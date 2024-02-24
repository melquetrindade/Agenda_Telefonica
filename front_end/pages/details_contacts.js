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
        dadosContato: undefined,
        dadosTell: undefined,
        dadosEnd: undefined,
        statesContato: 'load',
        statesTell: 'load',
        statesEnd: 'load'
    })

    const apiTelefones = 'http://127.0.0.1:8000/telefones/'
    const apiEnderecos = 'http://127.0.0.1:8000/enderecos/'

    const carregaContato = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/contatos/${id}/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                setStatus({
                    dadosContato: undefined,
                    dadosTell: status.dadosTell,
                    dadosEnd: status.dadosEnd,
                    statesContato: 'erro',
                    statesTell: status.statesTell,
                    statesEnd: status.statesEnd,
                })
            }
            const data = await response.json();
            
            setStatus({
                dadosContato: data,
                dadosTell: status.dadosTell,
                dadosEnd: status.dadosEnd,
                statesContato: 'ok',
                statesTell: status.statesTell,
                statesEnd: status.statesEnd,
            })

        } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setStatus({
                dadosContato: undefined,
                dadosTell: status.dadosTell,
                dadosEnd: status.dadosEnd,
                statesContato: 'erro',
                statesTell: status.statesTell,
                statesEnd: status.statesEnd,
            })
        }
    }

    const carregaTelefones = async () => {
    
        try {
            const response = await fetch(apiTelefones);
            
            if (!response.ok) {
              setStatus({
                dadosContato: status.dadosContato,
                dadosTell: undefined,
                dadosEnd: status.dadosEnd,
                statesContato: status.statesContato,
                statesTell: 'erro',
                statesEnd: status.statesEnd,
              })
            }

            const data = await response.json();
            var filterData = data.filter(item => item.owner == id)

            setStatus({
                dadosContato: status.dadosContato,
                dadosTell: filterData,
                dadosEnd: status.dadosEnd,
                statesContato: status.statesContato,
                statesTell: 'ok',
                statesEnd: status.statesEnd,
            })

          } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setStatus({
                dadosContato: status.dadosContato,
                dadosTell: undefined,
                dadosEnd: status.dadosEnd,
                statesContato: status.statesContato,
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
                    dadosContato: status.dadosContato,
                    dadosTell: status.dadosTell,
                    dadosEnd: undefined,
                    statesContato: status.statesContato,
                    statesTell: status.statesTell,
                    statesEnd: 'erro',
                })
            }

            const data = await response.json();
            var filterData = data.filter(item => item.contato == id)

            setStatus({
                dadosContato: status.dadosContato,
                dadosTell: status.dadosTell,
                dadosEnd: filterData,
                statesContato: status.statesContato,
                statesTell: status.statesTell,
                statesEnd: 'ok',
            })

          } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setStatus({
                dadosContato: status.dadosContato,
                dadosTell: status.dadosTell,
                dadosEnd: undefined,
                statesContato: status.statesContato,
                statesTell: status.statesTell,
                statesEnd: 'erro',
            })
          }
    }

    if(status.statesContato == 'load' && id != undefined){
        carregaContato()
    }
    if(status.statesTell == 'load' && id != undefined && status.statesContato != 'load'){
        carregaTelefones()
    }
    if(status.statesEnd == 'load' && id != undefined && status.statesContato != 'load' && status.statesTell != 'load'){
        carregaEnderecos()
    }

    return(
        <main className={styles.main}>
            {
                status.statesTell == 'load' || status.statesEnd == 'load' || status.statesContato == 'load'
                ?
                    <Load/>
                :
                status.statesTell == 'erro' || status.statesEnd == 'erro' || status.statesContato == 'erro'
                ?
                    <Error/>
                :
                    <Listar 
                        objTell={status.dadosTell} 
                        objEnd={status.dadosEnd} 
                        objCont={status.dadosContato} 
                        nameContato={nome}
                    />
            }
        </main>
    )
}

function Listar({objTell, objEnd, objCont, nameContato}){

    return(
        <main className={styles.body}>
            <Container>
                <h1 className={styles.nameTitle}>Informações de {nameContato}</h1>
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
                                <div className={styles.contPhones}>
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

                    <Col>
                            <div className={styles.contextContato}>
                                <h1>Email</h1>
                                <hr></hr>
                                <p>{objCont.email}</p>
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