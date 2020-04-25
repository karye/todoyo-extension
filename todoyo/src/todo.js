const vscode = require("vscode");

class Todo {
    clearConsoleLogs(context) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("Inget öppet dokument!");
            return;
        }

        /* Hämta nuvarande dokument */
        const doc = editor.document;

        /* Skapa en sidopanel */
        const panel = vscode.window.createWebviewPanel(
            "console.log()",
            "Kommentarer",
            vscode.ViewColumn.Beside, {
                enableScripts: true
            }
        );
        panel.webview.html = getWebviewContent();

        let kommentar = [];
        const smallNumberDecorationType = vscode.window.createTextEditorDecorationType({
            borderWidth: '1px',
            borderStyle: 'solid',
            overviewRulerColor: 'blue',
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            light: {
                // this color will be used in light color themes
                backgroundColor: 'pink',
                borderColor: 'red'
            },
            dark: {
                // this color will be used in dark color themes
                backgroundColor: 'brown',
                borderColor: 'lightblue'
            }
        });

        const text = doc.getText();
        console.log("doc.fileName", doc.fileName);
        console.log("doc.lineCount ", doc.lineCount);
        console.log("doc.lineAt(17) ", doc.lineAt(17).text);

        /* Vi söker efter console.log() */
        /* const regex = /(console.log\(\)|console.log\(.+\));/; */
        const regex = /\/\*.*\*\/|\/\//;

        /* Gå igenom alla rader */
        for (let i = 0; i < doc.lineCount; i++) {

            /* Plocka ut raden */
            const line = doc.lineAt(i);

            /* Hittat en console.log() */
            if (regex.test(line.text)) {
                console.log("Hittat log rad: ", line.lineNumber);
                kommentar.push({
                    range: new vscode.Range(line.range.start, line.range.end),
                    hoverMessage: 'Log'
                });
                panel.webview.postMessage({
                    command: 'start',
                    text: '<p id="rad' + line.lineNumber + '">Hittat: ' + line.lineNumber + '</p>'
                });
            }
        }
        /* Highlighta alla hittade rader */
        editor.setDecorations(smallNumberDecorationType, kommentar);

        //vscode.window.onDidChangeActiveTextEditor
        vscode.window.onDidChangeTextEditorSelection(() => {
            let line = editor.selection.start.line;
            console.log('line', line);
            
            panel.webview.postMessage({
                command: 'update',
                text: line
            });
        });
    }
}

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="sv">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Test</title>
        <style>
        .on {
            background: red;
        }
        </style>
    </head>
    <body>
        <h1>Kommentar i koden</h1>
        <div id="lista"></div>
        <div id="log"></div>
        <script>
            const lista = document.querySelector('#lista');
            const log = document.querySelector('#log');
            
            // Handle the message inside the webview
            window.addEventListener('message', event => {
                const message = event.data; // The JSON data our extension sent
                switch (message.command) {
                    case 'start':
                        log.innerHTML = message.text;
                        lista.innerHTML += message.text;
                        break;
                    case 'update':
                        log.innerHTML = message.text;
                        const element = document.querySelector('#rad' + message.text);
                        element.classList.toggle("on");
                        break;
                    default:
                        break;
                }
            });
        </script>
    </body>
    </html>`;
}

module.exports = Todo;