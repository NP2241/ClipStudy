'use client';

import { MagnifyingGlassIcon, PlusIcon, ViewVerticalIcon } from "@radix-ui/react-icons";
import { Box, Button, Card, Container, Dialog, Flex, Grid, Heading, Popover, ScrollArea, Separator, Strong, Text, TextField } from "@radix-ui/themes";
import React, { useState } from "react";

function Logo() {
  return <Text className="flex-grow">Logo</Text>;
}

function NewVideoPopover({children} : {children: React.ReactNode}) {
  const [url, setUrl] = useState('');
  const [search, setSearch] = useState('');

  return (
    <Popover.Root>
      <Popover.Trigger>
        {children}
      </Popover.Trigger>
      <Popover.Content>
        <Flex gap="2" direction="column">
          <Heading className="text-center mb-4">New video</Heading>

          <Text size="2" mb="-1"><Strong>YouTube URL</Strong></Text>
          <TextField.Root placeholder="Enter YouTube URL" className="w-[350px]" value={url} onChange={e => setUrl(e.target.value)}></TextField.Root>

          <Text mt="2" size="2" mb="-1"><Strong>Search query</Strong></Text>
          <Flex gap="2" align="center">
            <TextField.Root placeholder="Enter search query" className="w-[350px]" value={search} onChange={e => setSearch(e.target.value)}></TextField.Root>
          </Flex>

          <Button mt="2" onClick={() => {
            fetch(`/api/get?url=${encodeURIComponent(url)}&search=${encodeURIComponent(search)}`).then(r => r.json())
          }}>Submit</Button>
          
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}

export default function Home() {
  const [state, setState] = useState({
    sidebar: true,
    // newVideo: false,
    findVideo: false,
  });

  // function newVideo() {
  //   setState({...state, newVideo: true});
  // }
  function findVideo() {
    setState({...state, findVideo: true});
  }

  return (
    <>
      {/* <Dialog.Root open={state.newVideo} onOpenChange={v => setState({...state, newVideo: v})}>
        <Dialog.Content>
          <Dialog.Title>New video</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root> */}

      <Dialog.Root open={state.findVideo} onOpenChange={v => setState({...state, findVideo: v})}>
        <Dialog.Content>
          <Dialog.Title>Find video</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>

      <Grid columns={state.sidebar ? '20% auto 80%' : '55px auto calc(100% - 55px)'} width="calc(100% - 1px)" height="100vh">
        <Box className="mx-5">
          <Flex height="48px" align="center">
            {state.sidebar ? <Logo /> : null}
            <ViewVerticalIcon className="cursor-pointer" style={{opacity: state.sidebar ? 0.5 : 1}} onClick={() => setState({...state, sidebar: !state.sidebar})} />
          </Flex>
          {state.sidebar ? (
            <Flex direction="column" gap="2" mt="2">
              <NewVideoPopover>
                <Button variant="soft">
                  <PlusIcon />
                  New video
                </Button>
              </NewVideoPopover>
              <Button variant="soft" onClick={findVideo}>
                <MagnifyingGlassIcon />
                Find video
              </Button>
            </Flex>
          ) : (
            <Flex direction="column" gap="4" mt="2px">
              <NewVideoPopover>
                <PlusIcon className="cursor-pointer" />
              </NewVideoPopover>
              <MagnifyingGlassIcon className="cursor-pointer" onClick={findVideo} />
            </Flex>
          )}
        </Box>

        <Separator orientation="vertical" size="4" />

        <Box>
          <Grid height="48px" align="center" columns="3" className="mx-5">
            {/* <Text>test</Text> */}
          </Grid>
    
        </Box>

      </Grid>
    </>
  );
}
