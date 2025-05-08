/**
 * 
 * Code copied from: https://statgen.github.io/locuszoom/docs/api/ext_lz-intervals-track.js.html
 * and modified by Robert Vogel
 * 
 * @module
 */

// Coordinates (start, end) are cached to facilitate rendering
const XCS = Symbol.for('lzXCS');
const YCS = Symbol.for('lzYCS');
const XCE = Symbol.for('lzXCE');
const YCE = Symbol.for('lzYCE');

/**
 * (**extension**) Convert a value ""rr,gg,bb" (if given) to a css-friendly color string: "rgb(rr,gg,bb)".
 * This is tailored specifically to the color specification format embraced by the BED file standard.
 * @alias module:LocusZoom_ScaleFunctions~to_rgb
 * @param {Object} parameters This function has no defined configuration options
 * @param {String|null} value The value to convert to rgb
 * @see {@link module:ext/lz-intervals-track} for required extension and installation instructions
 */
function to_rgb(parameters, value) {
    return value ? `rgb(${value})` : null;
}

const default_layout = {
    start_field: 'start',
    end_field: 'end',
    track_label_field: 'state_name', // Used to label items on the y-axis
    // Used to uniquely identify tracks for coloring. This tends to lead to more stable coloring/sorting
    //  than using the label field- eg, state_ids allow us to set global colors across the entire dataset,
    //  not just choose unique colors within a particular narrow region. (where changing region might lead to more
    //  categories and different colors)
    track_split_field: 'state_id',
    track_split_order: 'DESC',
    split_tracks: true,
    track_height: 15,
    track_vertical_spacing: 3,
    bounding_box_padding: 2,
    always_hide_legend: false,
    color: '#B8B8B8',
    fill_opacity: 1,
};

/**
 * (**extension**) Implements a data layer that will render interval annotation tracks (intervals must provide start and end values)
 * Each interval (such as from a BED file) will be rendered as a rectangle. All spans can be rendered on the same
 *  row, or each (auto-detected) category can be rendered as one row per category.
 *
 * This layer is intended to work with a variety of datasets with special requirements. As such, it has a lot
 *  of configuration options devoted to identifying how to fill in missing information (such as color)
 *
 * @alias module:LocusZoom_DataLayers~intervals
 * @see module:LocusZoom_DataLayers~BaseDataLayer
 * @see {@link module:ext/lz-intervals-track} for required extension and installation instructions
 */
class LzIntervalsTrack extends LocusZoom.DataLayers.get("BaseDataLayer") {
    /**
     * @param {string} [layout.start_field='start'] The field that defines interval start position
     * @param {string} [layout.end_field='end'] The field that defines interval end position
     * @param {string} [layout.track_label_field='state_name'] Used to label items on the y-axis
     * @param {string} [layout.track_split_field='state_id'] Used to define categories on the y-axis. It is usually most convenient to use
     *  the same value for state_field and label_field (eg 1:1 correspondence).
     * @param {*|'DESC'} [layout.track_split_order='DESC'] When in split tracks mode, should categories be shown in
     *  the order given, or descending order
     * @param {number} [layout.track_split_legend_to_y_axis=2]
     * @param {boolean} [layout.split_tracks=true] Whether to show tracks as merged (one row) or split (many rows)
     *  on initial render.
     * @param {number} [layout.track_height=15] The height of each interval rectangle, in px
     * @param {number} [layout.track_vertical_spacing=3]
     * @param {number} [layout.bounding_box_padding=2]
     * @param {boolean} [layout.always_hide_legend=false] Normally the legend is shown in merged mode and hidden
     *  in split mode. For datasets with a very large number of categories, it may make sense to hide the legend at all times.
     * @param {string|module:LocusZoom_DataLayers~ScalableParameter[]} [layout.color='#B8B8B8'] The color of each datum rectangle
     * @param {number|module:LocusZoom_DataLayers~ScalableParameter[]} [layout.fill_opacity=1]
     */
    constructor(layout) {
        LocusZoom.Layouts.merge(layout, default_layout);
        super(...arguments);
        this._previous_categories = [];
        this._categories = [];
    }
    initialize() {
        super.initialize();
        this._statusnodes_group = this.svg.group.append('g')
            .attr('class', 'lz-data-layer-intervals lz-data-layer-intervals-statusnode');
        this._datanodes_group = this.svg.group.append('g')
            .attr('class', 'lz-data_layer-intervals');
    }
    /**
     * Split data into tracks such that anything with a common grouping field is in the same track
     * @param data
     * @return {unknown[]}
     * @private
     */
    _arrangeTrackSplit(data) {
        const {track_split_field} = this.layout;
        const result = {};
        data.forEach((item) => {
            const item_key = item[track_split_field];
            if (!Object.prototype.hasOwnProperty.call(result, item_key)) {
                result[item_key] = [];
            }
            result[item_key].push(item);
        });
        return result;
    }
    /**
     * Split data into rows using a simple greedy algorithm such that no two items overlap (share same interval)
     * Assumes that the data are sorted so item1.start always <= item2.start.
     *
     * This function can also simply return all data on a single row. This functionality may become configurable
     *  in the future but for now reflects a lack of clarity in the requirements/spec. The code to split
     *  overlapping items is present but may not see direct use.
     */
    _arrangeTracksLinear(data, allow_overlap = true) {
        if (allow_overlap) {
            // If overlap is allowed, then all the data can live on a single row
            return [data];
        }
        // ASSUMPTION: Data is given to us already sorted by start position to facilitate grouping.
        // We do not sort here because JS "sort" is not stable- if there are many intervals that overlap, then we
        //   can get different layouts (number/order of rows) on each call to "render".
        //
        // At present, we decide how to update the y-axis based on whether current and former number of rows are
        //  the same. An unstable sort leads to layout thrashing/too many re-renders. FIXME: don't rely on counts
        const {start_field, end_field} = this.layout;
        const grouped_data = [[]]; // Prevent two items from colliding by rendering them to different rows, like genes
        data.forEach((item, index) => {
            for (let i = 0; i < grouped_data.length; i++) {
                // Iterate over all rows of the
                const row_to_test = grouped_data[i];
                const last_item = row_to_test[row_to_test.length - 1];
                // Some programs report open intervals, eg 0-1,1-2,2-3; these points are not considered to overlap (hence the test isn't "<=")
                const has_overlap = last_item && (item[start_field] < last_item[end_field]) && (last_item[start_field] < item[end_field]);
                if (!has_overlap) {
                    // If there is no overlap, add item to current row, and move on to the next item
                    row_to_test.push(item);
                    return;
                }
            }
            // If this item would collide on all existing rows, create a new row
            grouped_data.push([item]);
        });
        return grouped_data;
    }
    /**
     * Annotate each item with the track number, and return.
     * @param {Object[]}data
     * @private
     * @return [String[], Object[]] Return the categories and the data array
     */
    _assignTracks(data) {
        // Flatten the grouped data.
        const {x_scale} = this.parent;
        const {start_field, end_field, bounding_box_padding, track_height} = this.layout;
        const grouped_data = this.layout.split_tracks ? this._arrangeTrackSplit(data) : this._arrangeTracksLinear(data, true);
        const categories = Object.keys(grouped_data);
        if (this.layout.track_split_order === 'DESC') {
            categories.reverse();
        }
        categories.forEach((key, row_index) => {
            const row = grouped_data[key];
            row.forEach((item) => {
                item[XCS] = x_scale(item[start_field]);
                item[XCE] = x_scale(item[end_field]);
                item[YCS] = row_index * this.getTrackHeight() + bounding_box_padding;
                item[YCE] = item[YCS] + track_height;
                // Store the row ID, so that clicking on a point can find the right status node (big highlight box)
                item.track = row_index;
            });
        });
        // We're mutating elements of the original data array as a side effect: the return value here is
        //  interchangeable with `this.data` for subsequent usages
        // TODO: Can replace this with array.flat once polyfill support improves
        return [categories, Object.values(grouped_data).reduce((acc, val) => acc.concat(val), [])];
    }

    _getTooltipPosition(tooltip) {
        return {
            x_min: tooltip.data[XCS],
            x_max: tooltip.data[XCE],
            y_min: tooltip.data[YCS],
            y_max: tooltip.data[YCE],
        };
    }

    /**
     * When we are in "split tracks mode", it's convenient to wrap all individual annotations with a shared
     *  highlight box that wraps everything on that row.
     *
     * This is done automatically by the "setElementStatus" code, if this function returns a non-null value
     *
     * To define shared highlighting on the track split field define the status node id override
     * to generate an ID common to the track when we're actively splitting data out to separate tracks
     * @override
     * @returns {String}
     */
    getElementStatusNodeId(element) {
        if (this.layout.split_tracks) {
            // Data nodes are bound to data objects, but the "status_nodes" selection is bound to numeric row IDs
            const track = typeof element === 'object' ? element.track : element;
            const base = `${this.getBaseId()}-statusnode-${track}`;
            return base.replace(/[^\w]/g, '_');
        }
        // In merged tracks mode, there is no separate status node
        return null;
    }
    // Helper function to sum layout values to derive total height for a single interval track
    getTrackHeight() {
        return this.layout.track_height
            + this.layout.track_vertical_spacing
            + (2 * this.layout.bounding_box_padding);
    }

    // Modify the layout as necessary to ensure that appropriate color, label, and legend options are available
    // Even when not displayed, the legend is used to generate the y-axis ticks
    // Implement the main render function
    render() {
        //// Autogenerate layout options if not provided
        // this._applyLayoutOptions();
        // Determine the appropriate layout for tracks. Store the previous categories (y axis ticks) to decide
        //   whether the axis needs to be re-rendered.
        this._previous_categories = this._categories;
        const [categories, assigned_data] = this._assignTracks(this.data);
        this._categories = categories;
        // Update the legend axis if the number of ticks changed
        const labels_changed = !categories.every( (item, index) => item === this._previous_categories[index]);
        if (labels_changed) {
            this.updateSplitTrackAxis(categories);
            return;
        }
        // Apply filters to only render a specified set of points. Hidden fields will still be given space to render, but not shown.
        const track_data = assigned_data
        // Clear before every render so that, eg, highlighting doesn't persist if we load a region with different
        //  categories (row 2 might be a different category and it's confusing if the row stays highlighted but changes meaning)
        // Highlighting will automatically get added back if it actually makes sense, courtesy of setElementStatus,
        //  if a selected item is still in view after the new region loads.
        this._statusnodes_group.selectAll('rect')
            .remove();
        // Reselect in order to add new data
        const status_nodes = this._statusnodes_group.selectAll('rect')
            .data(d3.range(categories.length));
        if (this.layout.split_tracks) {
            // Status nodes: a big highlight box around all items of the same type. Used in split tracks mode,
            //  because everything on the same row is the same category and a group makes sense
            // There are no status nodes in merged mode, because the same row contains many kinds of things
            // Status nodes are 1 per row, so "data" can just be a dummy list of possible row IDs
            // Each status node is a box that runs the length of the panel and receives a special "colored box" css
            //  style when selected
            const height = this.getTrackHeight();
            status_nodes.enter()
                .append('rect')
                .attr('class', 'lz-data_layer-intervals lz-data_layer-intervals-statusnode lz-data_layer-intervals-shared')
                .attr('rx', this.layout.bounding_box_padding)
                .attr('ry', this.layout.bounding_box_padding)
                .merge(status_nodes)
                .attr('id', (d) => this.getElementStatusNodeId(d))
                .attr('x', 0)
                .attr('y', (d) => (d * height))
                .attr('width', this.parent.layout.cliparea.width)
                .attr('height', Math.max(height - this.layout.track_vertical_spacing, 1));
            status_nodes.exit()
                .remove();
        }
        // Draw rectangles for the data (intervals)
        const data_nodes = this._datanodes_group.selectAll('rect')
            .data(track_data, (d) => d[this.layout.id_field]);
        data_nodes.enter()
            .append('rect')
            .merge(data_nodes)
            .attr('id', (d) => this.getElementId(d))
            .attr('x', (d) => {console.log(d);return d[XCS];})
            .attr('y', (d) => d[YCS])
            .attr('width', (d) => Math.max(d[XCE] - d[XCS], 1))
            .attr('height', this.layout.track_height)
            .attr('fill', (d, i) => this.resolveScalableParameter(this.layout.color, d, i))
            .attr('fill-opacity', (d, i) => this.resolveScalableParameter(this.layout.fill_opacity, d, i));

        data_nodes.exit()
            .remove();
        this._datanodes_group
            .call(this.applyBehaviors.bind(this));

        const text_nodes = this._datanodes_group.selectAll('text.gene-label')
            .data(track_data, (d) => d[this.layout.id_field] + '_label');
            
        // Add new text elements
        text_nodes.enter()
            .append('text')
            .attr('class', 'gene-label')
            .merge(text_nodes)
            .attr('x', (d) => d[XCS] + 3) // 3px offset from left edge
            .attr('y', (d) => d[YCS] + (this.layout.track_height / 2) + 4) // Center vertically + adjust
            .attr('text-anchor', 'start')
            .attr('font-size', '10px')
            .attr('font-style', 'italic')
            .attr('fill', '#000')
            .text((d) => {
                return d[this.layout.label_field];
            });
            
        // Remove old text elements
        text_nodes.exit().remove();

        return this;
    }

   // Redraw split track axis or hide it, and show/hide the legend, as determined
    // by current layout parameters and data
    updateSplitTrackAxis(categories) {
        const legend_axis = this.layout.track_split_legend_to_y_axis ? `y${this.layout.track_split_legend_to_y_axis}` : false;
        if (this.layout.split_tracks) {
            const tracks = +categories.length || 0;
            const track_height = +this.layout.track_height || 0;
            const track_spacing = 2 * (+this.layout.bounding_box_padding || 0) + (+this.layout.track_vertical_spacing || 0);
            const target_height = (tracks * track_height) + ((tracks - 1) * track_spacing);
            this.parent.scaleHeightToData(target_height);
            if (legend_axis && this.parent.legend) {
                this.parent.legend.hide();
                this.parent.layout.axes[legend_axis] = {
                    render: true,
                    ticks: [],
                    range: {
                        start: (target_height - (this.layout.track_height / 2)),
                        end: (this.layout.track_height / 2),
                    },
                };
                // There is a very tight coupling between the display directives: each legend item must identify a key
                //  field for unique tracks. (Typically this is `state_id`, the same key field used to assign unique colors)
                // The list of unique keys corresponds to the order along the y-axis
                this.layout.legend.forEach((element) => {
                    const key = element[this.layout.track_split_field];
                    let track = categories.findIndex((item) => item === key);
                    if (track !== -1) {
                        if (this.layout.track_split_order === 'DESC') {
                            track = Math.abs(track - tracks - 1);
                        }
                        this.parent.layout.axes[legend_axis].ticks.push({
                            y: track - 1,
                            text: element.label,
                        });
                    }
                });
                this.layout.y_axis = {
                    axis: this.layout.track_split_legend_to_y_axis,
                    floor: 1,
                    ceiling: tracks,
                };
            }
            // This will trigger a re-render
            this.parent_plot.positionPanels();
        } else {
            if (legend_axis && this.parent.legend) {
                if (!this.layout.always_hide_legend) {
                    this.parent.legend.show();
                }
                this.parent.layout.axes[legend_axis] = { render: false };
                this.parent.render();
            }
        }
        return this;
    }
    // Method to not only toggle the split tracks boolean but also update
    // necessary display values to animate a complete merge/split
    toggleSplitTracks() {
        this.layout.split_tracks = !this.layout.split_tracks;
        if (this.parent.legend && !this.layout.always_hide_legend) {
            this.parent.layout.margin.bottom = 5 + (this.layout.split_tracks ? 0 : this.parent.legend.layout.height + 5);
        }
        this.render();
        return this;
    }
}
/**
 * 
 * (**extension**) A data layer with some preconfigured options for intervals display. This example was designed for chromHMM output,
 *   in which various states are assigned numeric state IDs and (<= as many) text state names.
 *
 *  This layout is deprecated; most usages would be better served by the bed_intervals_layer layout instead.
 * @alias module:LocusZoom_Layouts~intervals_layer
 * @type data_layer
 * @see {@link module:ext/lz-intervals-track} for required extension and installation instructions
 */
const intervals_layer_layout =  {
    namespace: { 'intervals': 'intervals' },
    id: 'intervals',
    type: 'intervals',
    tag: 'intervals',
    id_field: '{{intervals:Start}}_{{intervals:End}}_{{intervals:state_name}}',
    start_field: 'intervals:Start',
    end_field: 'intervals:End',
    track_split_field: 'intervals:state_name',
    track_label_field: 'intervals:state_name',
    split_tracks: false,
    always_hide_legend: true,
    color: '#B8B8B8',
    legend: [] // Placeholder; auto-filled when data loads.
};


LocusZoom.DataLayers.add('intervals', LzIntervalsTrack);
LocusZoom.Layouts.add('data_layer', 'intervals', intervals_layer_layout);
