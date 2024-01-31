import NavBar from './nav_bar'

export default function MainContainer({children}){
    return(
        <div>
            <NavBar/>
            <div><div>{children}</div></div>
        </div>
    )
}