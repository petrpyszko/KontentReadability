import { DeliveryClient } from "@kentico/kontent-delivery";

export class RichTextClient {
    constructor(projectId, apiKey) {
        this.deliveryClient = new DeliveryClient({
            projectId: projectId,
            previewApiKey: apiKey,
            globalQueryConfig: {
                // Ensures that Preview API is used
                usePreviewMode: false
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
                        let htmlContent = response.items[0][richTextElementCodename].value;
                        let content = this._removeHTML(htmlContent);
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