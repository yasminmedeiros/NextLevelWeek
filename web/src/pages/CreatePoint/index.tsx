import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './style.css';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/Dropzone';

//Caixa de Pôr arquivos: npm install react-dropzone
//mapa : npm install leaflet react-leaflet
/// npm install @types/react-leaflet -D

import logo from '../../assets/logo.svg'

interface Item {
    id: number;
    title: string;
    image_url: string;
}
interface IBGEUFResponse {
    sigla: string;
}
interface IBGECITYResponse {
    nome: string;
}

const CreatePoint = () => {


    //array ou objeto:manualmente informar o tipo da variável
    const [itens, setItens] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [InitialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    const [selectedItens, setSelectedItens] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        api.get('itens').then(response => {
            console.log(response.data);
            setItens(response.data);
        });

    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude])
        });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, []);

    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    useEffect(() => {
        if (selectedUf === '0') {
            return;
        }
        axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data
                    .map(city => city.nome);
                setCities(cityNames);
            });
    }, [selectedUf]);


    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItens.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItens = selectedItens.filter(item => item !== id)
            setSelectedItens(filteredItens);
        } else {
            setSelectedItens([...selectedItens, id]);
        }

    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])

    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const itens = selectedItens;
        const data = new FormData();

        data.append('name',name);
        data.append('email',email);
        data.append('uf',uf); 
        data.append('whatsapp',whatsapp); 
        data.append('latitude',String(latitude));
        data.append('longitude',String(longitude));
        data.append('itens',itens.join(',')); 
        data.append('city',city);  
        
        if(selectedFile){
            data.append('image',selectedFile);
        }

        await api.post('points', data);
        alert('Ponto de coleta cadastrado');
        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to='/'>
                    <FiArrowLeft />
                        Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>
                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">

                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço do mapa</span>
                    </legend>

                    <Map center={InitialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}></Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado(UF)</label>
                            <select
                                value={selectedUf}
                                onChange={handleSelectUF}
                                name="uf" id="uf">

                                <option value="0">Selecione uma UF</option>
                                {ufs.map((uf) => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                onChange={handleSelectCity}
                                value={selectedCity}
                                name="city"
                                id="city">
                                <option value="0">Selecione uma cidade</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de Coleta</h2>
                        <span>Selecione um ou mais Ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {itens.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItens.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar Ponto de Coleta</button>
            </form>
        </div>
    );
};

export default CreatePoint;