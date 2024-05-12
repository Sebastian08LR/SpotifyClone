class AlbumGallery extends HTMLElement {
    constructor() {
        super();
    }
    
    async connectedCallback() {
        // Realizar la solicitud fetch a la API
        const url = 'https://spotify23.p.rapidapi.com/search/?q=Sol%20maria&type=multi&offset=0&limit=10&numberOfTopResults=5';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '4fadca553amsh359f23bdc84e5cdp1eab1bjsnb7e9266d4996',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        };
        
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            // Crear una variable para almacenar las plantillas HTML
            let templates = '';
            // Crear un array para almacenar las uris de los álbumes
            const uris = [];
            
            // Iterar sobre los primeros 6 álbumes
            for (let i = 0; i < Math.min(8, result.albums.items.length); i++) {
                // Verificar si el álbum tiene la propiedad "coverArt" y si tiene al menos una fuente
                if (result.albums.items[i].data && result.albums.items[i].data.coverArt && result.albums.items[i].data.coverArt.sources && result.albums.items[i].data.coverArt.sources.length > 0) {
                    // Extraer la primera URL dentro de "sources" del álbum
                    const primeraUrl = result.albums.items[i].data.coverArt.sources[0].url;
                    // Extraer la primera uri de cada ítem
                    const primeraUri = result.albums.items[i].data.uri;
                    // Agregar la uri al array
                    uris.push(primeraUri);
                    // Crear la plantilla HTML con la URL extraída
                    templates += `
                        <img id="album__${i + 1}" src="${primeraUrl}" alt="">
                    `;
                }
            }

            // Insertar las plantillas en la clase "albumGallery" del HTML
            this.innerHTML = templates;
            
            // Obtener todas las imágenes generadas por AlbumGallery
            const images = this.querySelectorAll('img');
            
            // Agregar evento de click a cada imagen
            images.forEach((image, index) => {
                image.addEventListener('click', () => {
                    // Obtener la uri correspondiente al índice de la imagen
                    const uri = uris[index];
                    // Crear y disparar un evento personalizado para pasar la uri
                    this.dispatchEvent(new CustomEvent('albumSelected', { detail: uri }));
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
}

customElements.define('album-gallery', AlbumGallery);

class MyFrame extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        this.attachShadow({ mode: "open" });
        // Escuchar el evento personalizado 'albumSelected' de AlbumGallery
        document.addEventListener('albumSelected', (event) => {
            // Obtener la uri del detalle del evento
            const uri = event.detail;
            // Obtener solo lo que está después del ":" en la uri
            const id = uri.split(':')[1];
            // Insertar el iframe con el id en el shadow DOM
            this.shadowRoot.innerHTML = `
                <iframe class="spotify-iframe" width="450" height="670" src="https://open.spotify.com/embed/album/${id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            `;
        });
    }
}

customElements.define("my-frame", MyFrame);