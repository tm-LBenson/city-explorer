import React, { Component } from 'react'
import Map from './Map'
import MessageBox from './MessageBox'
import ExploreForm from './ExploreForm'
import { Card } from 'react-bootstrap'
import styles from './Main.module.css'
import axios from 'axios'
import MovieDisplay from './MovieDisplay'



const findNewCity = async (city) => {
  try {
    const data = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.REACT_APP_GEO_KEY}&q=${city}&format=json`)
    return data;
  }
  catch (error) {
    const dataError = error.message
    return dataError
  }
}


export default class Main extends Component {
  constructor() {
    super()
    this.state = { city: '' }
  }

  getDataForSearch = (formValue) => {
    this.setState({ city: formValue })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.city && this.state.city !== prevState.city) {
      const data = findNewCity(this.state.city)
      data.then((data) => {

        if (data.data) {

          return this.setState({
            city: this.state.city,
            lon: data.data[0].lon,
            lat: data.data[0].lat,
            found: true,
            error: ''

          })
        } else if (typeof data === typeof '') {
          console.log('running')
          this.setState({ error: data, found: false, lon: '', lat: '', city: '' })
        }
      })
    }
  }

  render() {

    return (
      <div>
        <main className={styles.wrapper}>
          <section className={styles.form}>
            <Card className={styles.card}>
              <h1>City Explorer</h1>

              <ExploreForm onGetDataForSearch={this.getDataForSearch} />
            </Card>
          </section>
          <section className={styles.map}>
            <Card className={styles.cardMap}>
              <Map mapUrl={`https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_GEO_KEY}&center=${this.state.lat},${this.state.lon}&size=${this.state.found ? '300x200' : '1x1'}&zoom=10&path=fillcolor:%2390EE90|weight:2|color:blue|`} />
            </Card >
          </section>
          <section className={styles.weather}>
            <Card className={styles.card}>
              <MessageBox cityData={this.state} />
            </Card>
          </section>
          <section className={styles.movies}>
            <Card className={styles.card}>
              <MovieDisplay className={styles.movies} cityFound={this.state.found} queryData={this.state.city} />
            </Card>
          </section>
        </main>



      </div>
    )
  }
}
