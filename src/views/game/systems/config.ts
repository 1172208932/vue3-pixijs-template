let GameConfig = {
    speed:0,
    addSpeed:0.003,
    row:10,
    col:10
}

const isTextUrl = import.meta.env.VITE_RESOURCE_URL;
// Manifest Example
const manifest = {
    bundles: [
        {
            name: 'load-screen',
            assets: [
                {
                    name: 'icon1',
                    srcs: `${isTextUrl}icon1.png`,
                },
                {
                    name: 'icon2',
                    srcs: `${isTextUrl}icon2.png`,
                },
                {
                    name: 'icon3',
                    srcs: `${isTextUrl}icon3.png`,
                },
            ],
        }
    ]
};

export {
    GameConfig,
    manifest
}