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

        let kommentar = [];
        const smallNumberDecorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'pink',
            borderWidth: '1px',
            borderStyle: 'solid',
            overviewRulerColor: 'blue',
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            light: {
                // this color will be used in light color themes
                borderColor: 'red'
            },
            dark: {
                // this color will be used in dark color themes
                borderColor: 'lightblue'
            }
        });

        const text = doc.getText();
        console.log("doc.fileName", doc.fileName);
        console.log("doc.lineCount ", doc.lineCount);
        console.log("doc.lineAt(17) ", doc.lineAt(17).text);

        /* Vi söker efter kommentarer */
        const regex = /(console.log\(\)|console.log\(.+\));/;

        /* Dela upp i rader */
        //let rader = text.split("\n");
        //rader.forEach(rad => console.log(rad));

/*         rader.map((codeline, idx) => {
            //console.log(idx + 1, codeline);

            if (regex.test(codeline)) {
                console.log("Hittat: ", idx + 1, codeline);
                vscode.window.showInformationMessage(codeline);

                let startPos = editor.document.positionAt(20);
                let endPos = editor.document.positionAt(40);
                kommentar.push({
                    range: new vscode.Range(startPos, endPos),
                    hoverMessage: 'Number **123**'
                });
            }
        }); */

        /* Gå igenom alla rader */
        for (let i = 0; i < doc.lineCount; i++) {

            /* Plocka ut raden */
            const line = doc.lineAt(i);

            /* Hitta en kommentar */
            if (regex.test(line.text)) {
                console.log("Hittat: ", line.lineNumber);
                kommentar.push({
                    range: new vscode.Range(line.range.start, line.range.end),
                    hoverMessage: 'Number **123**'
                });
            }
        }

        editor.setDecorations(smallNumberDecorationType, kommentar);
    }
}

module.exports = Cleaner;