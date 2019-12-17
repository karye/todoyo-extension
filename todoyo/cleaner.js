const vscode = require("vscode");

class Cleaner {
    clearConsoleLogs() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("Inget öppet dokument!");
            return;
        }

        /* Hämta nuvarande dokument */
        const doc = editor.document;
        const text = doc.getText();

        console.log("doc.lineCount " + doc.lineCount);
        //console.log("doc.lineAt(17) " + doc.lineAt(17).text);

        /* Vad vi söker efter */
        const regex = /(console.log\(\)|console.log\(.+\));/;

        /* Dela upp i rader */
        let rader = text.split("\n");
        //rader.forEach(rad => console.log(rad));

        rader.map((codeline, idx) => {
            //console.log(idx + 1, codeline);

            if (regex.test(codeline)) {
                console.log("Hittat: ", idx + 1, codeline);
                vscode.window.showInformationMessage(codeline);
            }
        });
    }
}

module.exports = Cleaner;