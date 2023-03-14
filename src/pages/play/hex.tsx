import { Button, Center, Heading, Image, Link, Text } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';

import { getSaltongPageLayout } from '../../components/saltong/SaltongPageContent';
import { GAME_MODE_DATA } from '../../constants/gameList';
import { langServerSideProps } from '../../utils/lang';
import { NextPageWithLayout } from '../_app';

const SaltongHexPage: NextPageWithLayout = () => (
  <>
    <Head>
      <title>{GAME_MODE_DATA.hex.fullName} | Saltong Hub</title>
      {/* TODO: Update Description */}
      <meta name="description" content="The place for Filipino word games" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Center w="full" h="80vh" flexDir="column">
      <Image
        src="https://media.tenor.com/_CdH-tNG4bsAAAAC/sandale-sandali.gif"
        aria-label="wait"
      />
      <Heading mt={6}>Under Construction</Heading>
      <Text maxW="500px" textAlign="center">
        <b>Saltong Hex</b> will be arriving soon in Saltong Hub! In the
        meantime, you can play Saltong Hex on the original website.
      </Text>
      <Link isExternal href="https://saltong.carldegs.com/hex" mt={6}>
        <Button colorScheme="purple" size="lg">
          Play Saltong Hex
        </Button>
      </Link>
    </Center>
  </>
);

SaltongHexPage.getLayout = getSaltongPageLayout('hex');

export const getServerSideProps = langServerSideProps;

export default SaltongHexPage;
