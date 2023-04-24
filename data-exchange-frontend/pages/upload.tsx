import NavBar from './navbar'
import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import abi from "../src/data_transaction.json";
import { contractAddress } from "../src/address";
import { ethers } from "ethers";
import { Button, Checkbox, FormControlLabel, FormGroup, MenuItem, TextField } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import { Constants } from "../Constants";
declare const window: any;

export default function Upload() {
  const Web3 = require("web3")
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    const address = sessionStorage.getItem("wallet");
    if (address) {
      setAddress(address);
    }
  }, [])

  /*const categories = [
    {
      value: 'A',
      label: 'A',
    },
    {
      value: 'B',
      label: 'B',
    },
    {
      value: 'C',
      label: 'C',
    },
    {
      value: 'D',
      label: 'D',
    },
  ];*/

  const isAddressBlank = (address?: String): boolean => {
    return (address == null || address === "");
  }

  const getAccounts = async () => {
    try {
      return await window.ethereum.request({ method: 'eth_accounts' });
    } catch (e) {
      return [];
    }
  }

  const openMetamask = async () => {
    window.web3 = new Web3(window.ethereum);
    let userAddresses = await getAccounts();
    console.log("userAddress:", userAddresses)
    if (!userAddresses.length) {
      try {
        userAddresses = await window.ethereum.enable();
      } catch (e) {
        return false;
      }
    }
    return userAddresses.length ? userAddresses[0] : null;
  };

  const validateInputAddress = async (inputAddress?: String) => {
    let fromAddress;
    if (isAddressBlank(inputAddress)) {
      console.log("Calling openmMetamask to get user address");
      let userAddress = await openMetamask();
      fromAddress = userAddress;
      console.log("userAddress got from openMetamask: ", userAddress);
    }
    else {
      console.log("Using input address");
      fromAddress = inputAddress;
    }
    return fromAddress
  }

  const uploadData = async (data_name: String, data_hash: String, price: Number, purchase_Ml: boolean, data_desc: String) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const dataExchange = new ethers.Contract(
      contractAddress,
      abi.abi,
      signer
    );

    console.log(dataExchange)

    setIsProcessing(true);
    //event.preventDefault();

    try {
      //let fromAddress = await validateInputAddress(inputAddress);
      console.log("data_hash, dataName,price, purchaseMl,dataDesc,", data_hash, data_name, price, purchase_Ml, data_desc);

      const transaction = await dataExchange.uploadData(data_hash, data_name, price, purchase_Ml, data_desc)
        /*.send({
          from: address,
          value: purchase_Ml ? 1 : 0
        })
        .then((res: any) => {
          console.log("uploadResult", res)
        });*/
      console.log(transaction)
      const result = await transaction.wait()
      console.log(result)
      setIsProcessing(false);
      return Constants.MESSAGE_TRASACTION_UPLOAD_SUCCESSFULLY
    }
    catch (error) {
      setIsProcessing(false);
      console.log(error)
      return Constants.MESSAGE_TRASACTION_GENERAL_ERROR
    }
  }

  /*const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setMessage('');

  const uploadData = async (data_hash: String, dataName:String,price: Number, purchaseMl: boolean, dataDesc:String,inputAddress?: String) => {

      try {
        const result = await DataExchange.contractService.uploadData(dataHash, dataName, price, purchaseMl, dataDesc);
        setMessage(result);
      } catch (error) {
        console.log(error);
        setMessage('There was an error uploading the data.');
      }
  
      setIsProcessing(false);
    };
  
    const handleReset = () => {
      setDataHash('');
      setDataName('');
      setPrice(0);
      setPurchaseMl(false);
      setDataDesc('');
    };*/

  const [dataHash, setDataHash] = useState('');
  const [dataName, setDataName] = useState('');
  const [dataPrice, setPrice] = useState(0);
  const [dataPurchaseMl, setPurchaseMl] = useState(false);
  const [dataDesc, setDataDesc] = useState('');

  const DataNameInput = async (event) => {
    setDataName(event.target.value);
  };
  const DataHashInput = async (event) => {
    setDataHash(event.target.value);
  };
  const DataPriceInput = async (event) => {
    setPrice(event.target.value);
  }
  const DataPurchaseMlInput = async (event) => {
    setPurchaseMl(event.target.value);
  }
  const DataDescInput = async (event) => {
    setDataDesc(event.target.value);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    uploadData(dataHash, dataName, dataPrice, dataPurchaseMl, dataDesc);
    //setDataHash('');
  };
  return (
    <>
      <NavBar />
      <h1>Upload</h1>
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Data Name</InputLabel>
          <OutlinedInput
            id="nameInput"
            label="Data Name"
            type='text'
            value={dataName}
            onChange={DataNameInput}
            autoFocus
          />
        </FormControl>

        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Data Hash</InputLabel>
          <OutlinedInput
            id="hashInput"
            label="Data Hash"
            type='text'
            value={dataHash}
            onChange={DataHashInput}
          />
        </FormControl>

        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Price (in wei)</InputLabel>
          <OutlinedInput
            id="priceInput"
            label="Price (in wei)"
            type="number"
            value={dataPrice}
            onChange={DataPriceInput}
          />
        </FormControl>

        {/* <TextField
          id="categoryInput"
          select
          label="Select"
          defaultValue="EUR"
          helperText="Please select the data category"
          fullWidth
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
          </TextField> */}

        <FormControl>
          <FormControlLabel control={<Checkbox />} label="Purchase ML Service" value={dataPurchaseMl} onChange={DataPurchaseMlInput} />
        </FormControl>

        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Data Description</InputLabel>
          <OutlinedInput
            id="descriptionInput"
            label="Data Description"
            type='text'
            value={dataDesc}
            onChange={DataDescInput}
            multiline
            rows={4}
          />

          <Button type="submit">Upload Data</Button>
        </FormControl>

      </Box>

    </>
  )
}


function preventDefault() {
  throw new Error('Function not implemented.');
}
