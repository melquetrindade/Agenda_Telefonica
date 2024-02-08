import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from '../styles/contacts.module.css'
import {notification, message} from 'antd'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function DeleteContacts(){
    
    const [status, setStatus] = useState({
        dados: undefined,
        status: 'load'
    })

    const router = useRouter()

    const [api, contextHolder] = notification.useNotification();
    const openNotification = ({placement, title, descricao}) => {
    api.info({
        message: `${title}`,
        description: `${descricao}`,
        placement,
    });
    }

    const [messageApi, contextHolder2] = message.useMessage();
    const key = 'updatable';

    const openMessage = () => {
        messageApi.open({
        key,
        type: 'loading',
        content: 'Loading...',
        });
        setTimeout(() => {
            messageApi.open({
                key,
                type: 'success',
                content: 'Loaded!',
                duration: 2,
            });
        }, 1000);
    };

    const apiUrl = 'http://127.0.0.1:8000/contatos/'

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

    const deletarContato = async ({idContato}) => {
        openMessage()
        const apiUrl = `http://127.0.0.1:8000/contatos/${idContato}/`
    
        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            
            if (!response.ok) {
              openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Erro ao Deletar o Contato!'})
            }
            openNotification({placement: 'topRight', title: 'CONTATO DELETADO', descricao: 'O Contato foi Excluído da Agenda com Sucesso!'})
            setStatus({
                dados: undefined,
                status: 'load'
            })

        } catch (error) {
            openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Erro ao Deletar o Contato!'})
        }
    }

    const navPagEdit = ({idContato}) => {
        router.push({
            pathname: './edit_contacts',
            query: {id: idContato}
        })
    }

    const navPagCreate = () => {
        router.push({
            pathname: './create_contacts',
        })
    }

    const navPagDetails = async ({idContato, nomeContato}) => {
        router.push({
            pathname: './details_contacts',
            query: {id: idContato, nome: nomeContato}
        })
    }

    return(
        <main className={styles.main}>
            {contextHolder}
            {contextHolder2}
            {
                status.status == 'load'
                ?
                    <Load/>
                :
                status.status == 'erro'
                ?
                    <Error/>
                :
                    <Listar data={status.dados} func={deletarContato} funcEdit={navPagEdit} funcCreate={navPagCreate} funcDetails={navPagDetails}/>

            }
        </main>
    )
}

function Listar({data, func, funcEdit, funcCreate, funcDetails}){

    return(
        <div className={styles.body}>
            <h1>Lista de Contatos</h1>
            <hr></hr>
            <div className={styles.cont}>
                <Button variant="outline-success" size="sm" onClick={funcCreate}>
                    Criar novo Contato<span class="material-symbols-outlined">add</span>
                </Button>
            </div>
            <hr></hr>
            <div className={styles.containerContacts}>
                {
                    data.map((contato) => (
                        <div>
                            <Card >
                                <Card.Body>
                                    <Card.Title className={styles.name}>{contato.nome}</Card.Title>
                                    <hr></hr>
                                    <div className={styles.containerButtons}>
                                        <Button variant="outline-dark" size="sm" onClick={() => funcDetails({idContato: contato.id, nomeContato: contato.nome})}>
                                            Detalhes<span class="material-symbols-outlined">person</span>
                                        </Button>
                                        <Button variant="outline-primary" size="sm" onClick={() => funcEdit({idContato: contato.id})}>
                                            Editar<span class="material-symbols-outlined">edit</span>
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => func({idContato: contato.id})}>
                                            Deletar<span class="material-symbols-outlined">delete</span>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))
                }
            </div>
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

