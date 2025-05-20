
declare interface MouseSettings {
    action?:        string;
    status?:        string;
    exclusive?:     boolean;
};

declare interface MouseBehaviors {
    onmouseover:    Array<MouseSettings>;
    onmouseout:     Array<MouseSettings>;
    onclick:        Array<MouseSettings>;
};
