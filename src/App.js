import React, { Component } from 'react';
import favoriteStarT from './assets/favoriteStarT/favoriteStarT.png';
import favoriteStarT2 from './assets/favoriteStarT/favoriteStarT2.png';
import favoriteStarF2 from './assets/favoriteStarF/favoriteStarF2.png';
import Svg from './assets/left.svg';
import './css/App.css';
import Body from './components/Body';
import axios from 'axios';
import { dynamicSort, toObjectAssociative } from "./utils";
import { ListGroup, ListGroupItem, Card, CardTitle, CardSubtitle, CardText, CardBody, Badge } from 'reactstrap';

class App extends Component {

  //Cargamos el contructor de la clase y declaramos las funciones
  constructor(props) {

    super(props);

    this.state = { data: [], contactSelected: null, isContenedor: false }

    //Seteamos la funciones a utilizar
    this.handleOnClickContact = this.handleOnClickContact.bind(this);
    this.handleOnClickCloseContact = this.handleOnClickCloseContact.bind(this);
    this.handleOnClickIsFavorite = this.handleOnClickIsFavorite.bind(this);
    this._renderContacts = this._renderContacts.bind(this);

  }

  //Generamos la request a la api, y clonamos el objeto para trabajar sobre el
  componentDidMount() {
    let obj = this;
    axios
      .get("https://s3.amazonaws.com/technical-challenge/v3/contacts.json")
      .then(function (response) {
        obj.setState({
          data: response.data.sort(dynamicSort("name")),
          dataObj: toObjectAssociative(response.data, 'id')
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Funcion para seleccionar el contacto
  handleOnClickContact(contactSelected) {
    this.setState({ contactSelected });

    //Si la vista es de celular ocultamos las pantallas 
    if (window.innerWidth < 468) {
      this.setState({ isContenedor: true });
    }
  }

  //Funcion para cerrar la informacion del contacto
  handleOnClickCloseContact() {
    this.setState({
      contactSelected: null
    })

    //Si la vista es de celular ocultamos las pantallas 
    if (window.innerWidth < 468) {
      this.setState({ isContenedor: false });
    }
  }

  //Funcion para cambiar el estado de favorito a false o true pasandole como parametro su key dentro del objeto
  handleOnClickIsFavorite(id, isFavorite) {
    let dataObj = this.state.dataObj
    let data = this.state.data
    let key = dataObj[id].arrayKey
    data[key] = { ...this.state.data[key], isFavorite }
    this.setState({
      data,
      contactSelected: data[key]
    })
  }

  //mostramos los contactos por pantalla --> y le asignamos onclick la seleccion del mismo con el valor clave por dato
  _renderContacts(value, key) {
    return <div key={key} onClick={() => this.handleOnClickContact(value)} className="pointer">
      <ListGroupItem id="item">
        <img src={value.smallImageURL} width={64} height={64} alt={"contact"} id="contactImg" />
        <div className="imgContent">
          {value.isFavorite && <img src={favoriteStarT} alt={" contact"} className="star" />}
        </div>
        <div className="textContent">
          <h2 className="contactTitle">&nbsp;
          {value.name}</h2>
          <p className="contactSubtitle card-text"> {value.companyName ? value.companyName : <br />}</p>
        </div>
      </ListGroupItem>
    </div >;
  }

  //Mostramos la vista principal y le pasamos que filtre si es favorito o no
  render() {
    return <Body>
      <div className={this.state.isContenedor ? 'nonVisible' : 'contenedor'}>
        <ListGroup className="lista">
          <ListGroupItem color="secondary">
            Contacts
          </ListGroupItem>
          <ListGroupItem className="subtitle">
            Favorite Contacts
          </ListGroupItem>
          {this.state.data
            .filter(v => v.isFavorite)
            .map(this._renderContacts)}
          <ListGroupItem className="subtitle">
            Other Contacts
          </ListGroupItem>
          {this.state.data
            .filter(v => !v.isFavorite)
            .map(this._renderContacts)}
        </ListGroup>
      </div>

      {/*Si el contacto esta seleccionado mostramos su informacion --> y declaramos si es favorito o no para cambiar su estado, tambien por cada propiedad que mostramos del elemento preguntamos si existe para mostrarla o no*/}
      {
        this.state.contactSelected && <div className="contenedor2">
          <div>

            <ListGroup>
              <ListGroupItem color="secondary">
                <img src={Svg} width={20} height={20} onClick={this.handleOnClickCloseContact} alt={"return contact list"} className="pointer" />
                <span className="active pointer" onClick={this.handleOnClickCloseContact}>Contacts</span>

                {this.state.contactSelected.isFavorite ? (
                  <img src={favoriteStarT2} onClick={() => this.handleOnClickIsFavorite(this.state.contactSelected.id, !this.state.contactSelected.isFavorite)} width={20} height={20} id="star" alt={"make contact fav"} className="pointer" />
                ) : (
                    <img src={favoriteStarF2} onClick={() => this.handleOnClickIsFavorite(this.state.contactSelected.id, !this.state.contactSelected.isFavorite)} width={20} height={20} id="star" alt={"make contact unfav"} className="pointer" />
                  )}
              </ListGroupItem>
            </ListGroup>

            <Card>
              <img src={this.state.contactSelected.largeImageURL} width={250} height={250} alt={"contact info"} id="imgContacto" />
              <CardBody>
                {this.state.contactSelected.name ? (
                  <div>
                    <CardTitle>{this.state.contactSelected.name}</CardTitle>
                  </div>
                ) : ''}

                {this.state.contactSelected.companyName ? (
                  <div>
                    <CardSubtitle className="card-title card-text">{this.state.contactSelected.companyName}</CardSubtitle>
                    <hr className="my-3" />
                  </div>
                ) : <hr className="my-3" />}

                {this.state.contactSelected.phone['home'] ? (
                  <div>
                    <CardText>Phone: </CardText>
                    <CardSubtitle>{this.state.contactSelected.phone['home']}<Badge color="light">Home</Badge>
                    </CardSubtitle><hr className="my-3" />
                  </div>
                ) : ''}

                {this.state.contactSelected.phone['mobile'] ? (
                  <div>
                    <CardText>Phone: </CardText>
                    <CardSubtitle>{this.state.contactSelected.phone['mobile']}<Badge color="light">Mobile</Badge>
                    </CardSubtitle><hr className="my-3" />
                  </div>
                ) : ''}

                {this.state.contactSelected.phone['work'] ? (
                  <div>
                    <CardText>Phone: </CardText>
                    <CardSubtitle>{this.state.contactSelected.phone['work']}<Badge color="light">Work</Badge>
                    </CardSubtitle><hr className="my-3" />
                  </div>
                ) : ''}

                {this.state.contactSelected.address['street'] ? (
                  <div>
                    <CardText>Address: </CardText>
                    <CardSubtitle>{this.state.contactSelected.address['street']}</CardSubtitle>
                    <hr className="my-3" />
                  </div>
                ) : ''}

                {this.state.contactSelected.address['city'] ? (
                  <div>
                    <CardText>City: </CardText>
                    <CardSubtitle>{this.state.contactSelected.address['city']}</CardSubtitle>
                    <hr className="my-3" />
                  </div>
                ) : ''}

                {this.state.contactSelected.address['state'] ? (
                  <div>
                    <CardText>State: </CardText>
                    <CardSubtitle>{this.state.contactSelected.address['state']}</CardSubtitle>
                    <hr className="my-3" />
                  </div>
                ) : ''}

                {this.state.contactSelected.address['country'] ? (
                  <div>
                    <CardText>Country: </CardText>
                    <CardSubtitle>{this.state.contactSelected.address['country']}</CardSubtitle>
                    <hr className="my-3" />
                  </div>
                ) : ''}

                {this.state.contactSelected.address['zipCode'] ? (
                  <div>
                    <CardText>Zip Code: </CardText>
                    <CardSubtitle>{this.state.contactSelected.address['zipCode']}</CardSubtitle>
                    <hr className="my-3" />
                  </div>
                ) : ''}

                {this.state.contactSelected.birthdate ? (
                  <div>
                    <CardText>Birthdate: </CardText>
                    <CardSubtitle>{this.state.contactSelected.birthdate}</CardSubtitle>
                    <hr className="my-3" />
                  </div>
                ) : ''}

                {this.state.contactSelected.emailAddress ? (
                  <div>
                    <CardText>Email: </CardText>
                    <CardSubtitle>{this.state.contactSelected.emailAddress}</CardSubtitle>
                    <hr className="my-3" />
                  </div>
                ) : ''}

              </CardBody>
            </Card>
          </div>

        </div>
      }

    </Body >;
  }
}

export default App;
