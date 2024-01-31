import NavBar from './nav_bar'
import styles from '../styles/mainContainer.module.css'

export default function MainContainer({children}){
    return(
        <div>
            <NavBar/>
            <div className={styles.mainContainer}><div>{children}</div></div>
        </div>
    )
}