import { useState } from 'react';
import './App.css'
import { TopSongs } from './types';

function App() {
  // Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
  const [topFiveSongs, setTopFiveSongs] = useState([]);
  const [artist, setArtist] = useState({});
  const [showArtistResult, setShowArtistResult] = useState(false); // Estado para controlar a visibilidade dos resultados do artista
  const token = 'BQBogmKvHv1Ol5975GM0XRTklsEbpHsb9zfLod_KwmNFAw8WfT-AJnthcNoR84tka5pN8zPi4WkMysC-KmPMzbzPBiCLs6hxlvF5xGdJ9OoGtnUb2CiuJ9avQJX3AwB5hHq6lpZ2JMTnGHlgOecwipI3myZ1RTVA_9sWzt7riBK6_gRgA9nyyPeT7UaL_gDM0eDAyg18n7j7vny5yE9sTs-Ytmg247Se5XHKSdTZvyI6Mqeug30qeiF7CD60gMnqdv6o2a5nuQZSEyOYa0VwKCxr';

  async function fetchWebApi(endpoint, method) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
    });
    return await res.json();
  }

  async function getTopTracks() {
    // Verifique se topFiveSongs está vazio, o que significa que os resultados do "Top Five" estão ocultos
    if (topFiveSongs.length === 0) {
      // Obtenha e exiba os resultados do "Top Five"
      const songs: TopSongs = await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=5', 'GET');
      setTopFiveSongs(songs);
      setShowArtistResult(false); // Oculte os resultados do artista
    } else {
      // Se os resultados do "Top Five" estiverem visíveis, oculte-os definindo topFiveSongs como vazio
      setTopFiveSongs([]);
    }
  }

  async function searchForArtists(event) {
    event.preventDefault();
    const artistName = event.target[0].value;
    const params = new URLSearchParams({
      type: 'artist',
      q: artistName,
    });
    const artists = await fetchWebApi(`v1/search?${params}`, 'GET');
    setArtist(artists);
    console.log(artists.artists.items[0]);
    setShowArtistResult(true); // Mostrar os resultados do artista quando o botão "Pesquisar Artistas" for clicado
    setTopFiveSongs([]); // Ocultar os resultados do "Top Five" quando o botão "Pesquisar Artistas" for clicado
  }

  return (
    <div className='spotify'>
      <button className='button__search' onClick={getTopTracks}>Pesquisar Top 5</button>
      <ol className='lista__spotify'>
        {topFiveSongs.items && topFiveSongs.items.map((item) => <li className='item__lista'>{item.name}</li>)}
      </ol>
      <form className='artist__search' onSubmit={searchForArtists}>
        <label htmlFor="artist" className='artist__name'>Nome do artista</label>
        <input type="text" name='' id='artist'/>
        <button className='button__search'>Pesquisar Artista</button>
        {showArtistResult && (
          <div>
            <h2 className='text__artist__result'>Você digitou: <span className='artist__result'> {artist.artists?.items[0]?.name.toUpperCase()} </span></h2>
            <a href={artist.artists?.items[0]?.external_urls?.spotify} target='_blank' className='artist__details'>
              Acessar detalhes do artista
            </a>
            {/* Exiba outros detalhes do artista aqui */}
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
