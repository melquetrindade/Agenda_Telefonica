import React, {useState} from "react";
import { useRouter } from "next/router";
import styles from '../styles/edit_contacts.module.css'
import {notification, message} from 'antd'

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function EditContacts(){

    const router = useRouter()
    const { id} = router.query
    console.log(`id: ${id}`)

    const [objContato, setContato] = useState({
        nome: '',
        email: '',
        status: 'load'
    })

    const [objEndereco, setEndereco] = useState({
        rua: '',
        bairro: '',
        cidade: '',
        num: '',
        status: 'load'
    })

    const [objTelefone, setTelefone] = useState({
        dados: undefined,
        status: 'load'
    })

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
            Adicionar Novo Contato
        </Tooltip>
    );

    const formatData = () => {

        const dataContato = {
            nome: document.getElementById('formGridName').value,
            email: document.getElementById('formGridEmail').value,
        };

        const dataEndereco = {
            rua: document.getElementById('formGridRoad').value,
            bairro: document.getElementById('formGridReigh').value,
            cidade: document.getElementById('formGridCity').value,
            num: document.getElementById('formGridNumber').value,
        };

        var ok = true

        try{
            Object.keys(dataContato).forEach(key => {
                //console.log(key + ': ' + dataContato[key]);
    
                if(!dataContato[key]){
                    console.log('não tem value')
                    ok = false
                    openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Preencha os Campos Obrigatórios'})
                    throw new Error('StopIteration');
                    
                }
                console.log(`${key}: ok`)
                
            });
        } catch(error){
            if (error.message !== 'StopIteration') {
                throw error;
            }
        }

        if(ok){
            console.log('chama a função')
        }
    }

    const carregaContato = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/contatos/${id}/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                setContato({
                    nome: undefined,
                    email: undefined,
                    status: 'erro'
                })
            }

            const data = await response.json();
            
            setContato({
                nome: data.nome,
                email: data.email,
                status: 'ok'
            })

        } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setContato({
                nome: undefined,
                email: undefined,
                status: 'erro'
            })
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
           
            setTelefone({
                dados: filterData,
                status: 'ok'
            })

        } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setTelefone({
                dados: undefined,
                status: 'erro'
            })
        }
    }

    const carregaEndereco = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/enderecos/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                setEndereco({
                    rua: undefined,
                    bairro: undefined,
                    cidade: undefined,
                    num: undefined,
                    status: 'erro'
                })
            }

            const data = await response.json();
            var filterData = data.filter(item => item.contato == id)
            
            setEndereco({
                rua: filterData[0].rua,
                bairro: filterData[0].bairro,
                cidade: filterData[0].cidade,
                num: filterData[0].num,
                status: 'ok'
            })

        } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setEndereco({
                rua: undefined,
                bairro: undefined,
                cidade: undefined,
                num: undefined,
                status: 'erro'
            })
        }
    }

    if(objContato.status == 'load' && id != undefined && objTelefone.status == 'load' && objEndereco.status == 'load'){
        carregaContato()
    }
    if(objTelefone.status == 'load' && id != undefined && objContato.status != 'load' && objEndereco.status == 'load'){
        carregaTelefone()
    }
    if(objEndereco.status == 'load' && id != undefined && objContato.status != 'load' && objTelefone.status != 'load'){
        carregaEndereco()
    }

    const editaDados = async ({objData}) => {
        openMessage()
        fetch(contatoUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(objData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            openNotification({placement: 'topRight', title: 'Contato Editado', descricao: 'As Alterações foram feitas com Sucesso!'})
            setTimeout(function () {
                // Ação que será executada após o tempo específico
                router.back()
            }, 2000);
        })
        .catch(error => {
            console.error('Erro durante a requisição POST:', error);
        });
    }

    const handleChangeName = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setContato({
                nome: inputText,
                email: objContato.email,
                status: objContato.status
            })
        }
    }

    const handleChangeRoad = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setEndereco({
                rua: inputText,
                bairro: objEndereco.bairro,
                cidade: objEndereco.cidade,
                num: objEndereco.num,
                status: objEndereco.status
            })
        }
    }

    const handleChangeReighborhood = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setEndereco({
                rua: objEndereco.rua,
                bairro: inputText,
                cidade: objEndereco.cidade,
                num: objEndereco.num,
                status: objEndereco.status
            })
        }
    }

    const handleChangeCity = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setEndereco({
                rua: objEndereco.rua,
                bairro: objEndereco.bairro,
                cidade: inputText,
                num: objEndereco.num,
                status: objEndereco.status
            })
        }
    }

    const handleChangeNumber = (e) => {
        const inputText = e.target.value

        if (/^[A-Z 0-9']+$/.test(inputText) || inputText === '') {
            setEndereco({
                rua: objEndereco.rua,
                bairro: objEndereco.bairro,
                cidade: objEndereco.cidade,
                num: inputText,
                status: objEndereco.status
            })
        }
    }

    const handleChangeEmail = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9 @ . ']+$/.test(inputText) || inputText === '') {
            setContato({
                nome: objContato.nome,
                email: inputText,
                status: objContato.status
            })
        }
    }

    return(
        <main className={styles.main}>
            {
                objContato.status == 'load' || objTelefone.status == 'load' || objEndereco.status == 'load'
                ?
                    <Load/>
                :
                objContato.status == 'erro' || objTelefone.status == 'erro' || objEndereco.status == 'erro'
                ?
                    <Error/>
                :
                <Forms
                    context01={contextHolder}
                    context02={contextHolder2}
                    changeName={handleChangeName}
                    changeEmail={handleChangeEmail}
                    changeRoad={handleChangeRoad}
                    changeReigh={handleChangeReighborhood}
                    changeCity={handleChangeCity}
                    changeNumber={handleChangeNumber}
                    nome={objContato.nome}
                    email={objContato.email}
                    rua={objEndereco.rua}
                    bairro={objEndereco.bairro}
                    cidade={objEndereco.cidade}
                    num={objEndereco.num}
                    func={formatData}
                    funcRender={renderTooltip}
                    objPhone={objTelefone.dados}
                />
            }
        </main>
    )
}

function Forms({
        context01, 
        context02, 
        changeName, 
        changeEmail, 
        changeRoad,
        changeReigh,
        changeCity,
        changeNumber,
        nome, 
        email,
        rua,
        bairro,
        cidade,
        num,
        func,
        funcRender,
        objPhone
    }){
    return(
        <div className={styles.body}>
            {context01}
            {context02}
            <h1>Página de Criar Contatos</h1>
            <hr></hr>
            <Container>
                <Row className={styles.rowTop}>
                    <Col className={styles.colOne}>
                        <h1 style={{fontWeight: '300'}}>Contato</h1>
                        <Form className={styles.formContato}>
                            <Form.Group controlId="formGridName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Fulano de Tal" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeName}
                                value={nome}
                            />
                            </Form.Group>
        
                            <Form.Group controlId="formGridEmail">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="fulado@gmail.com" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeEmail}
                                value={email}
                            />
                            </Form.Group>
                        </Form>
                    </Col>

                    <Col>
                        <h1 style={{fontWeight: '300', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            Telefones 
                            
                            <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={funcRender}
                                >
                                <Button variant="success"><span class="material-symbols-outlined">add</span></Button>
                            </OverlayTrigger>
                        </h1>
                        <div className={styles.formTelefone}>
                            {
                                objPhone.map((item) => (
                                    <div onClick={func}>{item.telefone}<span class="material-symbols-outlined">edit</span></div>
                                ))
                            }
                        </div>
                    </Col>
                </Row>

                <Row>
                    <h1 style={{fontWeight: '300'}}>Endereço</h1>
                    <Form className={styles.formEndereco}>
                        <Row>
                            <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Cidade</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Rio de Janeiro" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeCity}
                                value={cidade}
                            />
                            </Form.Group>
    
                            <Form.Group as={Col} controlId="formGridReigh">
                            <Form.Label>Bairro</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Centro" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeReigh}
                                value={bairro}
                            />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} controlId="formGridRoad">
                            <Form.Label>Rua</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="7 de Setembro" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeRoad}
                                value={rua}
                            />
                            </Form.Group>
    
                            <Form.Group as={Col} controlId="formGridNumber">
                            <Form.Label>Nº</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="10" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeNumber}
                                value={num}
                            />
                            </Form.Group>
                        </Row>
                    </Form>
                </Row>
            </Container>
            <Button variant="success" size="sm" onClick={func}>
                Salvar Alterações<span class="material-symbols-outlined">check</span>
            </Button>
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
