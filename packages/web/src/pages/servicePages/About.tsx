import { Card } from "@mui/material";

function AboutPage() {
    return (
        <Card
            sx={{
                marginTop: "5vh",
                minHeight: "80vh",
                paddingLeft: "20%",
                paddingRight: "20%",
                paddingBottom: "2em",
            }}
        >
            <h1>Sobre nosotros</h1>
            <h2>Nuestra misión</h2>
            <p>
                Entregar información de productos disponibles en ferias, con el
                fin de poder facilitar las decisiones de compra de los clientes
                y, a su vez, reducir el tiempo invertido en realizarlas.
            </p>
            <h2>Nuestra visión</h2>
            <p>
                Ser líderes en el acceso a información de frutas y verduras
                disponibles en los locales de las diferentes ferias de la región
                metropolitana, generando el reconocimiento de la plataforma a
                nivel regional.
            </p>
            <h2>Nuestros valores</h2>
            <ul>
                <li>
                    Responsabilidad: asegurar la veracidad de la información que
                    presentamos.
                </li>
                <li>
                    Transparencia: transmitir toda la información pertinente a
                    cada cliente del servicio entregado.
                </li>
                <li>
                    Seguridad: asegurar que toda la información presentada o
                    adquirida se mantenga segura y sea verificada.
                </li>
                <li>
                    Confianza: entregar a los clientes un ambiente y servicio en
                    el que puedan sentirse tranquilos.
                </li>
            </ul>
        </Card>
    );
}

export default AboutPage;
