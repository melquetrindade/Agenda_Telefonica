import React, { useState } from "react";
import styles from '../styles/load_contacts.module.css'

export default function LoadContacts(){

    const [data, setData] = useState(undefined)
    const [states, setStates] = useState('load')

    /*
    const [status, setStatus] = useState({
        dados: [],
        status: 'load'
    })*/

    //console.log(status.dados.length)
    //console.log(status.status)

    console.log(data)
    console.log(states)

    const apiUrl = 'http://127.0.0.1:8000/clientes/'

    const carregaDados = async () => {
        console.log('entrou no carrega')
    
        try {
            // Substitua 'sua_url_da_api' pela URL real da sua API Django
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
              throw new Error('Erro ao buscar dados da API');
            }
    
            // Convertendo a resposta para JSON
            const data = await response.json();
    
            // Atualizando o estado com os dados da API
            //setDadosDaAPI(data);
            console.log('entrou aqui')
            setData(data)
            setStates('ok')
          } catch (error) {
            console.error('Erro na requisição da API:', error.message);
          }
    }


    if(data == undefined && states == 'load'){
        console.log('entrou no if do carregar')
        carregaDados()
    }

    if(states == 'ok'){
        console.log('ok')
    }

    if(data != undefined){
        console.log('entrou na confirmação')
        console.log(data)
    }
    //carregaDados2()
    
    return(
        <main>
            {
                states == 'load'
                ?
                    <Load/>
                :
                states == 'erro'
                ?
                    <Error/>
                :
                    <Listar data={data}/>

            }
        </main>
    )
}

/*
<main>
            {
                status.status == 'load'
                ?
                    <Load/>
                :
                status.status == 'erro'
                ?
                    <Error/>
                :
                    <Listar data={status.dados}/>

            }
        </main>
*/

function Listar({data}){
    
    console.log('entrou aqui')
    //console.log(data)

    return(
        <div>
            {
                data[0].nome
            }
        </div>
    )
}

function Load(){
    return(
        <div className={styles.fade}>
            <div class="spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

function Error(){
    return(
        <h1>Error</h1>
    )
}

