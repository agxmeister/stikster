export const howToUse = `
The Stikster is designed to visualize the tasks' lifecycle. To create a visualization,
you need to follow these steps:
    -   Create a timeline for given tasks: the JSON representation of tasks' data, grouped into branches,
        which of them represent a parent task and its subtasks.
    -   Create an anchor with given label: the JSON representation on the existing sticky note on a Miro board,
        that defines the spot on the board to put the visualization of the timeline.
    -   Create a visualization: the representation of the timeline on a Miro board.
    
There are the tools available for this purpose:
    -   create-anchor: creates an anchor. The anchor includes the sticky note's identity, position, and dimensions.
        This tool searches for a sticky note with the given label. If a proper sticky note is found,
        the anchor will be created.
    -   get-anchor: retrieves an anchor by its identity.
    -   create-timeline: creates a timeline for the given tasks.
    -   get-timeline: retrieves a timeline by its identity.
    -   create-visualization: creates a visualization for the given timeline and anchor.
`;
