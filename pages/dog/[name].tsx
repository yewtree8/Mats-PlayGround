import React, { useState } from "react";
import { dehydrate, useQuery } from "react-query";
import { Grid, Text, Button, Title, Image } from "@mantine/core";
import { Box, Modal, Typography } from '@mui/material';

import { queryClient, dogByName } from "../../src/api";

export async function getServerSideProps({ params }) {
  await queryClient.prefetchQuery(["dog"], () =>
    dogByName({ name: params.name })
  );

  return {
    props: {
      name: params.name,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const DogDetail: React.FunctionComponent<{
  name: string;
}> = ({ name }) => {
  const { data } = useQuery(["dog"], () => dogByName({ name }));

  if (!data.dog) {
    return <div>No dog found</div>;
  }

const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  const dogYearsAlive = () : number => {
    let ageInWeeks:number = data.dog.ageInWeeks;
    let humanAgeInYears = Math.floor(ageInWeeks / 52);
    let dogAgeInYears = Math.round(humanAgeInYears * 7);
    return Number(dogAgeInYears);
  }

  const calculateYearsAliveApprox = () => {
    let ageInWeeks:number = data.dog.ageInWeeks;
    let humanAgeInYears = Math.floor(ageInWeeks / 52).toFixed(1);
    return humanAgeInYears;
  }

  const AdoptionModal = () : any => {
    <>

    <Button fullWidth
    onClick={handleOpen}>Adopt {data.dog.name}</Button>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Adopt {data.dog.name} Today!
          </Typography>
        </Box>
      </Modal>
    </>
  }

  return (
    <Grid>
      <Grid.Col xs={12} md={6} lg={4}>
        <Image src={data.dog.image} alt={data.dog.name} />
      </Grid.Col>
      <Grid.Col xs={12} md={6} lg={4}>
        <Title order={1}>{data.dog.name}</Title>

        <Grid mt={10}>

          <Grid.Col span={4}>
            <Title order={5}>Age In Weeks</Title>
            <Text>{data.dog.ageInWeeks} Weeks Old</Text>
          </Grid.Col>
          <Grid.Col span={4}>
          <Title order={5}>Human years alive</Title>
            <Text>{calculateYearsAliveApprox()}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
          <Title order={5}>Dog years alive</Title>
            <Text>{dogYearsAlive()}</Text>
            
          </Grid.Col>

          <Grid.Col span={4}>
            <Title order={5}>Breed</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.dog.breed}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={5}>Sex</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.dog.sex}</Text>
          </Grid.Col>
          {data.dog.color && (
            <>
              <Grid.Col span={4}>
                <Title order={5}>Color</Title>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text>{data.dog.color}</Text>
              </Grid.Col>
            </>
          )}
        </Grid>
      </Grid.Col>

      <Grid.Col xs={12} md={6} lg={12}>
        
        <AdoptionModal />
      </Grid.Col>
    </Grid>

  );
};

export default DogDetail;
