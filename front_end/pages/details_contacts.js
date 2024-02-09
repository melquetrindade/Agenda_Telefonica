import React, {useState} from "react";
import { useRouter } from "next/router";
import styles from '../styles/details_contacts.module.css'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function DetailsContacts(){

    const router = useRouter()
    const { id, nome } = router.query
    console.log(`id: ${id} - nome: ${nome}`)

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
            var filterData = data.filter(item => item.owner == id)

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

            var filterData = data.filter(item => item.contato == id)

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
                    <Listar objTell={status.dadosTell} objEnd={status.dadosEnd} nameContato={nome}/>
            }
        </main>
    )
}

function Listar({objTell, objEnd, nameContato}){
    console.log('entrou no listar')
    console.log(objTell)
    console.log(objEnd)


    return(
        <main className={styles.body}>
            <Container>
                <h1>Informações de {nameContato}</h1>
                <hr></hr>
                <Row className={styles.containerCol}>
                    <Col>
                        <div className={styles.contextTell}>
                            <h1>Telefones</h1>
                            <hr></hr>
                            {
                                objTell.length == 0
                                ?
                                    <h1 className={styles.alerta}>O contato não possui Telefones!</h1>
                                :
                                <div>
                                    {
                                        objTell.map((item, index) => (
                                                <div>
                                                    <strong>Número {index + 1}:</strong> {item.telefone}
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            }
                            
                        </div>
                    </Col>
                    <Col>
                        <div className={styles.contextEnd}>
                            <h1>Endereço</h1>
                            <hr></hr>
                            {
                                objEnd.length == 0
                                ?
                                <h1 className={styles.alerta}>O contato não possui um Endereço!</h1>
                                :
                                <div className={styles.contentEnd}>
                                    <p><strong>Cidade:</strong> {objEnd[0].cidade}</p>
                                    <p><strong>Bairro:</strong> {objEnd[0].bairro}</p>
                                    <p><strong>Rua:</strong> {objEnd[0].rua}</p>
                                    <p><strong>Nº:</strong> {objEnd[0].num}</p>
                                </div>
                            }
                        </div>
                    </Col>
                </Row>
            </Container>
        </main>
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