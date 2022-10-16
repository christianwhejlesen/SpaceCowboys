export default class Utils {

    constructor() {
        this.assets = null;
        this.assetsToLoad = 0;
    }

    loadAssets(assets) {
        this.assets = assets;
        if (!this.assets || this.assets.length == 0) {
            this.newGame();
            return;
        }
        if (this.assets) {
            this.assetsToLoad = this.assets.length;

            for (let i = 0; i < this.assets.length; i++) {
                if (this.assets[i].var != undefined) {
                    if (this.assets[i].type == "IMG") {
                        this.beginLoadingImage(
                            this.assets[i].var,
                            this.assets[i].src);
                    }
                    if (this.assets[i].type == "AUDIO") {
                        this.beginLoadingAudio(
                            this.assets[i].var,
                            this.assets[i].src);
                    }
                }
            }
        }
    }

    launchIfReady() {
        this.assetsToLoad--;
        if (this.assetsToLoad == 0) {
            this.newGame();
        }
    }

    beginLoadingImage(imgVar, fileName) {
        eval(`this.${imgVar} = new Image();`);
        eval(`this.${imgVar}.src = '${fileName}';`);
        eval(`this.${imgVar}`).onload = () => this.launchIfReady();
    }

    beginLoadingAudio(audioVar, fileName) {
        eval(`this.${audioVar} = 'new Audio(${fileName}');`);
        eval(`this.${audioVar}`).addEventListener('canplay', () => this.launchIfReady());
    }
}