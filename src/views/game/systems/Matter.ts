import * as Matterjs from 'matter-js';

interface MatterAliases {
    Engine: any,
    Render: any,
    Runner: any,
    Composites: any,
    MouseConstraint: any,
    Mouse: any,
    World: any,
    Bodies: any,
}

const Matter: MatterAliases = {
    Engine: Matterjs.Engine,
    Render: Matterjs.Render,
    Runner: Matterjs.Runner,
    Composites: Matterjs.Composites,
    MouseConstraint: Matterjs.MouseConstraint,
    Mouse: Matterjs.Mouse,
    World: Matterjs.World,
    Bodies: Matterjs.Bodies,
};

export default Matter;