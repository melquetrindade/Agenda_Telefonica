import React, { useState } from "react";
import styles from '../styles/load_contacts.module.css'

export default function LoadContacts(){
    
    const [status, setStatus] = useState({
        dados: undefined,
        status: 'load'
    })

    const apiUrl = 'http://127.0.0.1:8000/clientes/'

    const carregaDados = async () => {
    
        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
              setStatus({
                dados: undefined,
                status: 'erro'
              })
            }

            const data = await response.json();

            setStatus({
                dados: data,
                status: 'ok'
            })

          } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setStatus({
                dados: undefined,
                status: 'erro'
            })
          }
    }

    if(status.dados == undefined && status.status == 'load'){
        carregaDados()
    }

    return(
        <main className={styles.main}>
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
    )
}

function Listar({data}){

    return(
        <div>
            <h1>Lista de Contatos</h1>
            <hr></hr>
            {
                data.map((contato) => (
                    <div>
                        <h5>Nome: {contato.nome}</h5>
                        <p>Endereço: {contato.endereco}</p>
                        <p>Idade: {contato.idade}</p>
                        <hr></hr>
                    </div>
                ))
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

