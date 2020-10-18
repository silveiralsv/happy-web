import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';

import {  FiPlus } from "react-icons/fi";


import '../styles/pages/create-orphanage.css';
import SideBar from "../components/SideBar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";

export default function CreateOrphanage() {

  const history = useHistory();

  const [position, setPosition] = useState({lat: 0, lng: 0});
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [openOnWeekends, setopenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleMapClick = (event:LeafletMouseEvent) => {

    
    setPosition(event.latlng)
  }

  const handleSelectImages = (event: ChangeEvent<HTMLInputElement>) => {
    if(!event.target.files){
      return;
    }

    const selectedImages = Array.from(event.target.files)
    setImages(selectedImages)

    const selectedImagesPreview = selectedImages.map(eachImage => {
      return URL.createObjectURL(eachImage)
    })

    setPreviewImages(selectedImagesPreview);
    
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const data = new FormData()

    data.append('name', name);
    data.append('latitude', String(position.lat));
    data.append('longitude', String(position.lng));
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(openOnWeekends));

    images.forEach(image => {
      data.append('images', image);
    })

    api.post('orphanages',data).then(response => {
      alert('Cadastro realizado com sucesso');
      history.push('/app');
    });
    
  }

  return (
    <div id="page-create-orphanage">
      <SideBar/>

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-23.6485368,-46.6470185]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'/> 

              {position.lat !== 0 
                && (<Marker interactive={false} icon={mapIcon} position={[position.lat,position.lng]} />)}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
              id="name" 
              value={name} 
              onChange={event => {
                setName(event.target.value)
              }} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <input 
              id="name" 
              value={about} 
              onChange={event => {
                setAbout(event.target.value)
              }} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => (
                  <img key={image} src={image} alt={name}/>
                ))}
                <label  htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input multiple onChange={handleSelectImages} type="file"  id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <input 
              id="opening_hours" 
              value={instructions} 
              onChange={event => {
                setInstructions(event.target.value)
              }} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input 
              id="opening_hours" 
              value={opening_hours} 
              onChange={event => {
                setOpeningHours(event.target.value)
              }} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                type="button" 
                className={openOnWeekends ? 'active' : ''}
                onClick={() => setopenOnWeekends(true)}>
                  Sim
                </button>
                <button 
                type="button"
                className={!openOnWeekends ? 'active' : ''}
                onClick={() => setopenOnWeekends(false)}>
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
