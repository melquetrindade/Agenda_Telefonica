import React, {useState} from "react";
import { useRouter } from "next/router";
import styles from '../styles/edit_phone.module.css'
import {notification, message} from 'antd'

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function EditContacts(){

    const router = useRouter()
    const { id } = router.query
    console.log(`id: ${id}`)

    const [objTelefone, setTelefone] = useState({
        dados: undefined,
        status: 'load'
    })

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
    
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Adicione um novo número
        </Tooltip>
    );

    const formatData = ({destino, num, idNum}) => {

        const dataTelefone = {
            owner: document.getElementById('formGridName').value,
            telefone: document.getElementById('formGridEmail').value,
        };

        var ok = true

        try{
            Object.keys(dataTelefone).forEach(key => {
                if(!dataTelefone[key]){
                    console.log(`entrou aqui: ${key}`)
                    ok = false
                    //openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Preencha os Campos Obrigatórios'})
                    throw new Error('StopIteration');
                    
                }
            });
        } catch(error){
            if (error.message !== 'StopIteration') {
                throw error;
            }
        }
        
        //console.log(`ok? ${ok}`)
        if(ok){
            //console.log()
            //console.log(destino)
            //console.log(num)
            //console.log(idNum)
            setEditData({
                statusCont: editData.statusCont,
                statusEnd: editData.statusEnd,
                destino: destino,
                id: id,
                num: num,
                idPhone: idNum,
            })

            if(!editData.statusCont){
                editaContato({objData: dataContato})
            }
            if(!editData.statusEnd && editData.statusCont && objEndereco.rua != undefined){
                //console.log('entrou para editar o endereco')
                editaEndereco({objData: dataEndereco})
            }
            
            //console.log(`status editContato: ${editData.statusCont}`)
            //console.log(`status editEndereço: ${editData.statusEnd}`)
            //console.log(`conteúdo da rua: ${objEndereco.rua}`)
        }
    }

    const carregaTelefone = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/telefones/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                setTelefone({
                    dados: undefined,
                    status: 'erro'
                })
            }

            const data = await response.json();
            var filterData = data.filter(item => item.owner == id)
            console.log(filterData)
            setTelefone({
                dados: filterData,
                status: 'ok'
            })
            
        } catch (error) {
            console.log('entrou no erro de telefone')
            console.error('Erro na requisição da API:', error.message);
            setTelefone({
                dados: undefined,
                status: 'erro'
            })
        }
    }

    if(objTelefone.status == 'load' && id != undefined){
        carregaTelefone()
    }

    const editaTelefone = async ({objData}) => {
        fetch(`http://127.0.0.1:8000/telefones/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(objData),
        })
        .then(response => {
            if (!response.ok) {
                console.log('falha ao fazer a edição')
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('edição realizada com sucesso')
            
        })
        .catch(error => {
            console.error('Erro durante a requisição POST:', error);
        });
    }

    /*
    const handleChangeNumber = (e) => {
        const inputText = e.target.value

        if (/^[0-9']+$/.test(inputText) || inputText === '') {
            setEndereco({
                rua: objEndereco.rua,
                bairro: objEndereco.bairro,
                cidade: objEndereco.cidade,
                num: inputText,
                status: objEndereco.status
            })
        }
    }*/

    const deleteNumber = async ({idNumber}) => {
        openMessage()
        try {
            const response = await fetch(`http://127.0.0.1:8000/telefones/${idNumber}/`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            
            if (!response.ok) {
              openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Erro ao Deletar o Contato!'})
            }
            setTimeout(function () {
                setTelefone({
                    dados: undefined,
                    status: 'load'
                })
            }, 1500);

        } catch (error) {
            openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Erro ao Deletar o Contato!'})
        }
    }

    const navEditContato = () => {
        router.push({
            pathname: './edit_contacts',
            query: {id: id}
        })
    }

    const navEditNumber = ({num, idNumber}) => {
        router.push({
            pathname: './edit_number',
            query: {id: id, num: num, idNum: idNumber}
        })
    }

    const navContacts = () => {
        router.push({
            pathname: './contacts',
        })
    }

    const navCreateNumber = () => {
        router.push({
            pathname: './create_number',
            query: {id: id}
        })
    }

    return(
        <main className={styles.main}>
            {
                objTelefone.status == 'load'
                ?
                    <Load/>
                :
                objTelefone.status == 'erro'
                ?
                    <Error/>
                :
                <Forms
                    context01={contextHolder}
                    context02={contextHolder2}
                    funcEditNumber={navEditNumber}
                    funcDeleteNumber={deleteNumber}
                    funcRender={renderTooltip}
                    navPagInicial={navContacts}
                    navEditCont={navEditContato}
                    objData={objTelefone.dados}
                    funcCreateNumber={navCreateNumber}
                    show={show}
                    funcHandleClose={handleClose}
                    funcHandleShow={handleShow}
                />
            }
        </main>
    )
}

function Forms({
    context01, 
    context02, 
    funcEditNumber,
    funcDeleteNumber,
    funcRender,
    navPagInicial,
    navEditCont,
    objData,
    funcCreateNumber,
    show,
    funcHandleClose,
    funcHandleShow
    }){
    return(
        <div className={styles.body}>
            {context01}
            {context02}
            <h1 style={{fontWeight: '300', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                Telefones 
                
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={funcRender}
                    >
                    <Button onClick={funcCreateNumber} variant="success"><span class="material-symbols-outlined">add</span></Button>
                </OverlayTrigger>
            </h1>
            <hr></hr>
            <Container>
                <Row className={styles.rowTop}>
                    <div className={styles.formTelefone}>
                        {
                            objData.length == 0
                            ?
                                <div>
                                    <h1 style={{fontWeight: '300', fontSize: '1.5rem'}}>O contato não possui números de Telefones. Adicione um no botão acima!</h1>
                                </div>
                            :
                                <div className={styles.contPhones}>
                                    {
                                        objData.map((item) => (
                                            <div>
                                                <div className={styles.numero}>{item.telefone}</div>
            
                                                <div className={styles.spanEdit}><span onClick={() => funcEditNumber({num: item.telefone, idNumber: item.id})} class="material-symbols-outlined">edit</span></div>
            
                                                <div className={styles.spanDelete}><span onClick={() => funcDeleteNumber({idNumber: item.id})} class="material-symbols-outlined">delete</span></div>
                                            </div>
                                        ))
                                    }
                                </div> 
                        }
                    </div>
                </Row>
            </Container>

            <div className={styles.contButtons}>
                
                <Button variant="success" size="sm" onClick={funcHandleShow}>
                    Concluir Edição<span class="material-symbols-outlined">check</span>
                </Button>

                <Modal
                    show={show}
                    onHide={funcHandleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Edição Concluída</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        Para onde deseja ser redirecionado?
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={navPagInicial}>
                            Página Inicial
                        </Button>
                        <Button variant="primary" onClick={navEditCont}>
                            Voltar para Edição
                        </Button>
                    </Modal.Footer>
                </Modal>
            
            </div>
        </div>
    )
}

/*

<Button variant="primary" onClick={handleShow}>
                    Launch static backdrop modal
                </Button>

<div className={styles.contButtons}>
                <Button variant="success" size="sm" onClick={funcSuccess}>
                    Salvar Alterações<span class="material-symbols-outlined">check</span>
                </Button>

                <Button variant="danger" size="sm" onClick={funcCancel}>
                    Cancelar Alterações<span class="material-symbols-outlined">cancel</span>
                </Button>
            </div>
*/

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
