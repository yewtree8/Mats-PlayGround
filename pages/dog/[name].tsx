import React from "react";
import { dehydrate, useQuery } from "react-query";
import { Grid, Text, Button, Title, Image } from "@mantine/core";

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


const DogDetail: React.FunctionComponent<{
  name: string;
}> = ({ name }) => {
  const { data } = useQuery(["dog"], () => dogByName({ name }));

  if (!data.dog) {
    return <div>No dog found</div>;
  }

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
        <Button fullWidth>Adopt {data.dog.name}</Button>
      </Grid.Col>
    </Grid>
  );
};

export default DogDetail;
