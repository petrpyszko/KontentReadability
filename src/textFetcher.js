const delivery = require("@kentico/kontent-delivery");

class RichTextClient {
    constructor(projectId, apiKey) {
        this.deliveryClient = new delivery.DeliveryClient({
            projectId: projectId,
            previewApiKey: apiKey,
            globalQueryConfig: {
                // Ensures that Preview API is used
                usePreviewMode: !!apiKey
            }
        });
    }

    getRichTextValue(sourceItemId, richTextElementCodename) {
        return new Promise((resolve, reject) => {
            try {
                this.deliveryClient
                    .items()
                    .equalsFilter('system.id', sourceItemId)
                    .elementsParameter([richTextElementCodename])
                    .toPromise()
                    .then(response => {
                        if(!response.items[0] || !response.items[0][richTextElementCodename]) {
                          reject({message: "Wrong itemId or element codename."})
                          return;
                        }

                        let element = response.items[0][richTextElementCodename];
                        let content = this._removeHTML(element.value);
                        resolve(content);
                    });
            } catch (error) {
                reject(error);
            }
        });
    }

    _removeHTML(text) {
        let htmless = text.replace(/<(?:.|\n)*?>/gm, "");
        return htmless.replace(/&nbsp;/gi, " ");
    }
}

module.exports = RichTextClient;
