import React, {useState} from "react";
import { useRouter } from "next/router";
import styles from '../styles/details_contacts.module.css'

export default function DetailsContacts(){

    const router = useRouter()
    const { id, nome } = router.query
    console.log(`id: ${id} - nome: ${nome}`)

    //const [telefones, setTelefones] = useState(undefined)
    //const [enderecos, setEnderecos] = useState(undefined)
    const [status, setStatus] = useState({
        dadosTell: undefined,
        dadosEnd: undefined,
        statesTell: 'load',
        statesEnd: 'load'
    })

    const apiTelefones = 'http://127.0.0.1:8000/telefones/'
    const apiEnderecos = 'http://127.0.0.1:8000/enderecos/'

    const carregaTelefones = async () => {
    
        try {
            const response = await fetch(apiTelefones);
            
            if (!response.ok) {
              setStatus({
                dadosTell: undefined,
                dadosEnd: status.dadosEnd,
                statesTell: 'erro',
                statesEnd: status.statesEnd,
              })
            }

            const data = await response.json();
            var filterData = data.filter(item => item.owner == 1)

            setStatus({
                dadosTell: filterData,
                dadosEnd: status.dadosEnd,
                statesTell: 'ok',
                statesEnd: status.statesEnd,
            })

          } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setStatus({
                dadosTell: undefined,
                dadosEnd: status.dadosEnd,
                statesTell: 'erro',
                statesEnd: status.statesEnd,
            })
          }
    }

    const carregaEnderecos = async () => {
    
        try {
            const response = await fetch(apiEnderecos);
            
            if (!response.ok) {
                setStatus({
                    dadosTell: status.dadosTell,
                    dadosEnd: undefined,
                    statesTell: status.statesTell,
                    statesEnd: 'erro',
                })
            }

            const data = await response.json();

            var filterData = data.filter(item => item.contato == 1)

            setStatus({
                dadosTell: status.dadosTell,
                dadosEnd: filterData,
                statesTell: status.statesTell,
                statesEnd: 'ok',
            })

          } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setStatus({
                dadosTell: status.dadosTell,
                dadosEnd: undefined,
                statesTell: status.statesTell,
                statesEnd: 'erro',
            })
          }
    }

    if(status.dadosTell == undefined && status.statesTell == 'load' && id != undefined){
        carregaTelefones()
    }

    if(status.dadosEnd == undefined && status.statesEnd == 'load' && id != undefined){
        carregaEnderecos()
    }

    return(
        <main className={styles.main}>
            {
                status.statesTell == 'load' || status.statesEnd == 'load'
                ?
                    <Load/>
                :
                status.statesTell == 'erro' || status.statesEnd == 'erro'
                ?
                    <Error/>
                :
                    <Listar objTell={status.dadosTell} objEnd={status.dadosEnd}/>
            }
        </main>
    )
}

function Listar({objTell, objEnd}){
    console.log('entrou no listar')
    console.log(objTell)
    console.log(objEnd)


    return(
        <h1>Função de Listagem</h1>
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