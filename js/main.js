
class myframe extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.renderFrame();
    }

    renderFrame() {
        const uri = this.getAttribute('uri');
        if (uri) {
            // Obtener el ID del álbum de la URI
            const id = uri.split(':')[2];
            this.shadowRoot.innerHTML = `
                <iframe class="spotify-iframe" width="450" height="670" src="https://open.spotify.com/embed/album/${id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            `;
        } else {
            this.shadowRoot.innerHTML = '';
        }
    }

    static get observedAttributes() {
        return ["uri"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'uri' && oldVal !== newVal) {
            this.renderFrame();
        }
    }
}
customElements.define("my-frame",myframe)


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
                'X-RapidAPI-Key': '5e5c08d7a5msh0681cf2d0e77a32p1469d8jsn50978c3fbc20',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        };  
        
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            // Crear una variable para almacenar las plantillas HTML
            let templates = '';
            
            // Iterar sobre los primeros 6 álbumes
            for (let i = 0; i < Math.min(8, result.albums.items.length); i++) {
                // Verificar si el álbum tiene la propiedad "coverArt" y si tiene al menos una fuente
                if (result.albums.items[i].data && result.albums.items[i].data.coverArt && result.albums.items[i].data.coverArt.sources && result.albums.items[i].data.coverArt.sources.length > 0) {
                    // Extraer la primera URL dentro de "sources" del álbum
                    const primeraUrl = result.albums.items[i].data.coverArt.sources[0].url;
                    const uri = result.albums.items[i].data.uri;
                    // Extraer el ID de la URI
                    const id = uri.split(':')[2]; // Obtener el tercer elemento después de dividir la URI por ":"
                    // Crear la plantilla HTML con la URL extraída y el atributo de datos personalizado
                    templates += `
                        <img id="album__${i + 1}" src="${primeraUrl}" alt="" data-id="${id}">
                    `;
                }
            }
    
            // Insertar las plantillas en la clase "albumGallery" del HTML
            this.innerHTML = templates;
    
            // Agregar un event listener para cada imagen
            this.querySelectorAll('img').forEach(img => {
                img.addEventListener('click', () => {
                    // Obtener el valor del atributo de datos 'data-id'
                    const id = img.dataset.id;
                    // Obtener el elemento my-frame existente
                    const myFrame = document.querySelector('.main__frame');
                    // Actualizar el atributo 'uri' con el nuevo ID
                    myFrame.setAttribute('uri', `spotify:album:${id}`);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
}


customElements.define('album-gallery', AlbumGallery);

class MayLikeSection extends HTMLElement {
    constructor() {
        super();
    }
    
    async connectedCallback() {
        // Realizar la solicitud fetch a la API
        const url = 'https://spotify23.p.rapidapi.com/search/?q=Sol%20maria&type=multi&offset=0&limit=10&numberOfTopResults=5';
        const options = {
        method: 'GET',
            headers: {
                'X-RapidAPI-Key': '5e5c08d7a5msh0681cf2d0e77a32p1469d8jsn50978c3fbc20',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        }; 

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            // Crear una variable para almacenar las plantillas HTML
            let templates = '';
            
            // Iterar sobre los primeros 6 álbumes
            // Verificar si hay resultados de playlists
            if (result && result.playlists && result.playlists.items) {
                // Iterar sobre cada playlist
                result.playlists.items.slice(0, 6).forEach(playlist => {
                    // Extraer la primera URL dentro de "sources"
                    const primeraUrl = playlist.data.images.items[0].sources[0].url;
                    // Extraer los objetos "name" y "description"
                    const nombre = playlist.data.name;
                    let descripcion = playlist.data.description;

                    // Limitar la descripción si es necesario
                    if (descripcion.length > 200) {
                        descripcion = descripcion.substring(0, 50 - 3) + '...';
                    }
                    // Imprimir los resultados
                    templates += `
                        <div class="mayLikeSongs">
                            <img src="${primeraUrl}" alt="" >
                            <div class="mayLikeName">
                                <p>${nombre}</p>
                                <p class="descritionMayLike">"${descripcion}"</p>
                            </div>
                            <p>time 11:00</p>
                        </div>
                    `;
                });
            } else {
                console.log('No se encontraron resultados de playlist en la respuesta.');
            }

            // Insertar las plantillas en la clase "albumGallery" del HTML
            this.innerHTML = templates;
        } catch (error) {
            console.error(error);
        }
    }
}

customElements.define('may-like', MayLikeSection);
