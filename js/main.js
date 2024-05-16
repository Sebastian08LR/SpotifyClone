
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
            const typeOf = uri.split(':')[1];
            if(typeOf == "album" && window.innerWidth <= 800){
                this.shadowRoot.innerHTML = `
                    <iframe class="spotify-iframe" width="100%" height="90%" src="https://open.spotify.com/embed/${typeOf}/${id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                `;
            }
            else if(typeOf == "album"){
                this.shadowRoot.innerHTML = `
                    <iframe class="spotify-iframe" width="100%" height="670" src="https://open.spotify.com/embed/${typeOf}/${id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                `;
            }
            else if(typeOf == "track"){
                this.shadowRoot.innerHTML = `
                    <iframe class="spotify-iframe" width="100%" height="400" src="https://open.spotify.com/embed/${typeOf}/${id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                `;
            }
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
        const loadAlbums = async (searchTerm) => {
            const formattedSearchTerm = searchTerm.replace(/\s/g, '%20');

            const url = `https://spotify23.p.rapidapi.com/search/?q=${formattedSearchTerm}&type=albums&offset=0&limit=10&numberOfTopResults=5`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '157dd91ab6mshc69413ddcfde592p1a000ejsnb77fb9a8c2a8',
                    'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
                }
            };  

            try {
                const response = await fetch(url, options);
                const result = await response.json();
                let templates = '';
                for (let i = 0; i < Math.min(8, result.albums.items.length); i++) {
                    if (result.albums.items[i].data && result.albums.items[i].data.coverArt && result.albums.items[i].data.coverArt.sources && result.albums.items[i].data.coverArt.sources.length > 0) {
                        // First URL from "sources"
                        const primeraUrl = result.albums.items[i].data.coverArt.sources[0].url;
                        const uri = result.albums.items[i].data.uri;
                        // Extract ID from URI
                        const id = uri.split(':')[2];
                        templates += `
                            <img id="album__${i + 1}" src="${primeraUrl}" alt="" data-id="${id}">
                        `;
                    }
                }
                this.innerHTML = templates;
        
                // Set the addEventLister for each img and extracts the URI saved previously
                this.querySelectorAll('img').forEach(img => {
                    img.addEventListener('click', () => {
                        const id = img.dataset.id;
                        const myFrame = document.querySelector('.main__frame');
                        myFrame.setAttribute('uri', `spotify:album:${id}`);
                        const AlbumTracksComponent = document.querySelector('.trackList');
                        AlbumTracksComponent.setAttribute('uri', `spotify:album:${id}`);
                    });
                });
            } catch (error) {
                console.error(error);
            }
        };

        // Llama a la función loadAlbums con el término de búsqueda predeterminado
        loadAlbums('Bad%20Bunny');

        // Agregar evento al botón de búsqueda
        const searchButton = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm !== '') {
                loadAlbums(searchTerm);
            }
        });

        // Agregar evento al input para permitir la búsqueda al presionar Enter
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm !== '') {
                    loadAlbums(searchTerm);
                }
            }
        });
    }
}

customElements.define('album-gallery', AlbumGallery);


class MayLikeSection extends HTMLElement {
    constructor() {
        super();
    }
    
    async connectedCallback() {
        const url = 'https://spotify23.p.rapidapi.com/search/?q=Sol%20maria&type=multi&offset=0&limit=10&numberOfTopResults=5';
        const options = {
        method: 'GET',
            headers: {
                'X-RapidAPI-Key': '157dd91ab6mshc69413ddcfde592p1a000ejsnb77fb9a8c2a8',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        }; 

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            let templates = '';
            if (result && result.playlists && result.playlists.items) {
                // Iterar sobre cada playlist
                result.playlists.items.slice(0, 6).forEach(playlist => {
                    // First URL from  "sources"
                    const primeraUrl = playlist.data.images.items[0].sources[0].url;
                    //  "name" and "description"
                    const nombre = playlist.data.name;
                    let descripcion = playlist.data.description;
                    // Limit of characters 
                    if (descripcion.length > 200) {
                        descripcion = descripcion.substring(0, 50 - 3) + '...';
                    }
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
            this.innerHTML = templates;
        } catch (error) {
            console.error(error);
        }
    }
}

customElements.define('may-like', MayLikeSection);

class AlbumTracksComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.renderFrame();
    }

    async renderFrame() {
        const uri = this.getAttribute('uri');
        if (uri) {
            const id = uri.split(':')[2];
            await this.loadTrackList(id);
        }
    }

    async loadTrackList(albumId) {
        const url = `https://spotify23.p.rapidapi.com/albums/?ids=${albumId}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '157dd91ab6mshc69413ddcfde592p1a000ejsnb77fb9a8c2a8',
                'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            // Obtener el primer álbum de la respuesta
            const album = result.albums[0];

            // Obtener la URL de la tercera imagen
            const imageUrl = album.images[2].url;

            // Crear la plantilla HTML para cada pista del álbum
            let templates = '';
            album.tracks.items.forEach(track => {
                templates += `
                    <div class="track__songsName">
                        <i class='bx bx-menu'></i>
                        <img src="${imageUrl}" alt="" data-id="${track.uri}">
                        <div class="track__description">
                            <div>
                                <h4>${track.name}</h4>
                                <p class="artist__name">${track.artists[0].name}</p>
                            </div>
                            <div class="track__time">
                                <p class="track__año">${album.release_date}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            this.innerHTML = templates;

            setTimeout(() => {
                this.querySelectorAll('.track__songsName').forEach(track => {
                    track.classList.add('active');
                });
            }, 100);
            
            this.querySelectorAll('img').forEach(img => {
                img.addEventListener('click', () => {
                    const id = img.dataset.id;
                    const myFrame = document.querySelector('.main__frame');
                    myFrame.setAttribute('uri', `${id}`);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    static get observedAttributes() {
        return ['uri'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'uri' && oldValue !== newValue) {
            this.renderFrame();
        }
    }
}

customElements.define('album-tracks', AlbumTracksComponent);




