
class myframe extends HTMLElement{
    id
    constructor(id){
        super();
        this.attachShadow({mode: "open"});
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = /*html*/`
        <iframe class="spotify-iframe" width="450" height="670" src="https://open.spotify.com/embed/album/${this.id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `
    }
    static get observedAttributes(){
        return ["uri"];
    }
    attributeChangedCallback(name,old,now){
        let[nameUri, album, id] = now.split(":")
        this.id = id;
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
                'X-RapidAPI-Key': '4fadca553amsh359f23bdc84e5cdp1eab1bjsnb7e9266d4996',
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
                    // Crear la plantilla HTML con la URL extraída
                    templates += `
                        <img id="album__${i + 1}" src="${primeraUrl}" alt="">
                    `;
                }
            }

            // Insertar las plantillas en la clase "albumGallery" del HTML
            this.innerHTML = templates;
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
                'X-RapidAPI-Key': '4fadca553amsh359f23bdc84e5cdp1eab1bjsnb7e9266d4996',
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
