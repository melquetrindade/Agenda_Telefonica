import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from '../styles/contacts.module.css'
import {notification, message} from 'antd'

import Button from 'react-bootstrap/Button';

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

    const deletarContato = async ({idContato}) => {
        openMessage()
        const apiUrl = `http://127.0.0.1:8000/clientes/${idContato}/`
    
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
                    <Listar data={status.dados} func={deletarContato} funcEdit={navPagEdit} funcCreate={navPagCreate}/>

            }
        </main>
    )
}

function Listar({data, func, funcEdit, funcCreate}){

    return(
        <div>
            <h1>Lista de Contatos</h1>
            <hr></hr>
            <div className="d-grid gap-2">
                <Button variant="outline-success" size="sm" className={styles.contButton} onClick={funcCreate}>
                    Criar novo Contato<span class="material-symbols-outlined">add</span>
                </Button>
            </div>
            <hr></hr>
            {
                data.map((contato) => (
                    <div>
                        <h5>Nome: {contato.nome}</h5>
                        <p>Endereço: {contato.endereco}</p>
                        <p>Idade: {contato.idade}</p>
                        <div className="d-grid gap-2">
                            <Button variant="outline-primary" size="sm" className={styles.contButton} onClick={() => funcEdit({idContato: contato.id})}>
                                Editar Contato<span class="material-symbols-outlined">edit</span>
                            </Button>
                            <Button variant="outline-danger" size="sm" className={styles.contButton} onClick={() => func({idContato: contato.id})}>
                                Deletar Contato<span class="material-symbols-outlined">delete</span>
                            </Button>
                        </div>
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

