window.print = function (options) {
    console.log('window.print() OFF :: ...');
};
    var _____ = globalThis.this;

_____.print_options = {
    show: false,
    print: true,
    silent: true,
    printBackground: true,
    printSelectionOnly: false,
    color: true,
    landscape: false,
    pagesPerSheet: null,
    collate: false,
    copies: 1,
    pageRanges: {
        from: 0,
        to: 0,
    },
    duplexMode: null,
    scaleFactor: null,
    // dpi: { horizontal: 600, vertical: 600 },
    header: null,
    footer: null,
    pageSize: 'A4',
    deviceName: 'Microsoft Print to PDF',
};

_____.loadPrintOptions = function (info) {
    _____.print_options = {
        ..._____.print_options,
        ...info.options,
    };

    if (typeof _____.print_options.pageSize == 'object') {
        if (!_____.print_options.pageSize.height) {
            _____.print_options.pageSize.height = document.querySelector('html').clientHeight * 264.5833;
        }
        if (!_____.print_options.pageSize.width) {
            _____.print_options.pageSize.width = document.querySelector('html').clientWidth * 264.5833;
        }
    }

    if (_____.print_options.width) {
        _____.window.setSize(_____.print_options.width, 720);
    }

    if (_____.print_options.show) {
        _____.window.show();
    }

    if (_____.print_options.print) {
        _____.webContents.print(_____.print_options);
    }
};

window.addEventListener('load', () => {
    let id = document.location.href.split('/').pop();
    fetch('http://127.0.0.1:60080/data-content/' + id, {
        mode: 'cors',
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
        .then((res) => res.json())
        .then((data) => {
            _____.loadPrintOptions(data);
        })
        .catch((err) => {
            _____.log('loadPrintOptions', err);
        });
});
