
document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var fileInput = document.getElementById('fileInput');
    var formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    }).then(response => response.json()).then(data => {
        alert(data.message);
        loadFiles();
    }).catch(error => {
        console.error('Error:', error);
    });
});

function loadFiles() {
    fetch('/files')
        .then(response => response.json())
        .then(files => {
            var imageContainer = document.getElementById('imageContainer');
            imageContainer.innerHTML = '';
            files.forEach(file => {
                var item = document.createElement('div');
                item.className = 'image-item';

                var img = document.createElement('img');
                img.src = '/download/' + file;
                img.alt = file;
                item.appendChild(img);

                var buttons = document.createElement('div');
                buttons.className = 'buttons';

                var downloadButton = document.createElement('button');
                downloadButton.textContent = 'Download';
                downloadButton.addEventListener('click', function () {
                    var link = document.createElement('a');
                    link.href = '/download/' + file;
                    link.download = file;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });

                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function () {
                    fetch('/delete/' + file, {
                        method: 'DELETE'
                    }).then(response => response.json()).then(data => {
                        alert(data.message);
                        loadFiles();
                    }).catch(error => {
                        console.error('Error:', error);
                    });
                });

                buttons.appendChild(downloadButton);
                buttons.appendChild(deleteButton);
                item.appendChild(buttons);
                imageContainer.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    loadFiles();
});