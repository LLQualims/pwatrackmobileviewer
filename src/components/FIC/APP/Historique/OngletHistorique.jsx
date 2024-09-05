import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OngletHistorique.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';


const HistoriqueList = (props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [nbresult, setnbResult] = useState(0);
  const [archives, setArchives] = useState(true);
 

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${localStorage.getItem('URLServeur')}/app/appareil/${props.id}/historique`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`,
            SousEntites: '1',
            Archives: archives ? '1' : '0' 
          }
        });

        if (Array.isArray(response.data.contenu)) {
          setData(response.data.contenu);
          setnbResult(response.data.contenu.length);
        } else {
          throw new Error('Les données récupérées ne sont pas un tableau');
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  },[archives, props.id]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  
    const getImageOperation = (idappNatureOperation, nomImage) => {
      let img = nomImage;
      
      switch(idappNatureOperation) {
        case 1: case 2:
          return require('../../../../assets/Images/APP_Acquisition-128-1.png');
        case 90: case 98:
          return require('../../../../assets/Images/APP_Derogation-128-1.png');
        case 94:
          return require('../../../../assets/Images/APP_MiseHorsService-128-1.png');
        case 95:
          return require('../../../../assets/Images/APP_RemiseEnService-128-1.png');
        case 96:
          return require('../../../../assets/Images/APP_MiseEnReserve-128-1.png');
        case 97:
          return require('../../../../assets/Images/APP_MiseAuRebut-128-1.png');
        default:
          return require(`../../../../assets/Images/${img.replace("XX-X.XXX", "128-1.png")}`);
      }
    };

  return (
    <div className='tabHistorique'>
      <p className='titreonglet'>LISTE DES OPÉRATIONS</p>
      <div className='headeroperations'>
        <p className='nbresultat'>{nbresult} opérations</p>
          <FormControlLabel className='selectarchives' value="start" control={<Switch  checked={archives} onChange={(event) => setArchives(event.target.checked)}/>} label="Afficher les archives" labelPlacement="start"/>
      </div>
      
      {loading ? (
        <Box sx={{ marginTop: "10%" }}>
          <CircularProgress />
        </Box>
      ) : (
        data.map((item) => (
           <button key={item.idappOperation}  className='list-item-button' type="button">
           <div className='statutoperation'></div>
           <img src={getImageOperation(item.idappNatureOperation,item.appNatureOperation.nomImage)} alt={`Image of ${item.idappNatureOperation}`} className="item-image" />
           <div className='contenu'>
           <p className='natureoperation'>{item.appNatureOperation.designationNatureOperation}</p>
           <p className='dateoperation'>{new Date(item.dateOperation).toLocaleDateString()} {`${item.heureOperation.slice(0, 2)}:${item.heureOperation.slice(2, 4)}:${item.heureOperation.slice(4, 6)}`}</p>
           </div>
         </button>
        ))
      )}
    </div>
  );
};

export default HistoriqueList;