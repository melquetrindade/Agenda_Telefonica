import styles from '../styles/index.module.css'
import React, {useState} from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function Home() {

  return (
    <main className={styles.main}>
      <div className={styles.body}>
        <Container>
          <Row>
            <Col>
              <h1 className={styles.title}>Conectando Você: Sua Agenda Telefônica Pessoal para Manter os Contatos à Mão</h1>
            </Col>
            
            <Col>
              <div className={styles.contImg}>
                <img src='/img01.jpg'></img>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </main>
  )
}
