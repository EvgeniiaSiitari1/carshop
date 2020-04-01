import React, {useState, useEffect} from 'react';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Addcar from './Addcar'
import Editcar from './Editcar'

export default function Carlist() {

const [cars, setCars] = useState([]);
const [open, setOpen] = useState(false);

useEffect(()=> {
getCars();
}, [])

const getCars = () => {
    fetch('https://carstockrest.herokuapp.com/cars')
    .then(response => response.json())
    .then(data => setCars(data._embedded.cars))
    .catch (err => console.error(err))

}

const deleteCar =(link) => {
    if (window.confirm('Are you sure?')) 
    fetch(link, {method: 'DELETE'})
    .then (response => getCars())
    .then(_ => setOpen(true))
    .catch(err => console.error(err))
}

const handleClose = () => {
    setOpen(false);
}

const saveCar = (car) => {
    fetch('https://carstockrest.herokuapp.com/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
    })
    .then (response => getCars())
    .catch(err=> console.error(err))
}

const updateCar = (car, link) => {
    fetch(link,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
    })
    .then (response => getCars())
    .catch(err=> console.error(err))
    
}
const columns = [
    {
        Header: 'Brand',
        accessor: 'brand'
    },

    {
        Header: 'Model',
        accessor: 'model'
    },

    {
        Header: 'Color',
        accessor: 'color'
    },

    {
        Header: 'Year',
        accessor: 'year'
    },

    {
        Header: 'Fuel',
        accessor: 'fuel'
    },

    {
        Header: 'Price(€)',
        accessor: 'price'
    },
{
    filterable: false,
    sortable: false,
    minWidth: 80,
    Cell: row => (<Editcar updateCar = {updateCar} car={row.original}/>)
},
    { 
        accessor: '_links.self.href',
        filterable: false,
        sortable: false,
        minWidth: 80,
        Cell: row => (<Button variant="contained" size='small' color='secondary' onClick={() => deleteCar(row.value)}>Delete</Button>)
       
    }
]

    return (
        <div>
            <Addcar  saveCar={saveCar} />
        <ReactTable filterable={true} defaultPageSize={10}
         data={cars} columns={columns}/>
         <Snackbar
         open={open} autoHideDuration={3000}
          onClose={handleClose} 
          message="Car deleted successfully"/>
        </div>
    )
}