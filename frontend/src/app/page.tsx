//@ts-nocheck
'use client';

import { MagnifyingGlassIcon, PlusIcon, ViewVerticalIcon } from "@radix-ui/react-icons";
import { Box, Button, Card, Container, Dialog, Flex, Grid, Heading, Popover, ScrollArea, Separator, Strong, Text, TextField } from "@radix-ui/themes";
import React, { useRef, useState } from "react";
import YouTube from "react-youtube";


function Logo() {
  return <Text className="flex-grow">Logo</Text>;
}

function NewVideoPopover({children, setVideo} : {children: React.ReactNode}) {
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
            // fetch(`/api/get/${encodeURIComponent(url)}&prompt=${encodeURIComponent(search)}`)
            // .then(r => r.json())
            // .then(d => {
              // hardcoded for now
              let d = {"query":"density","segments":[{"end":"00:03:15,040","relevance_score":5,"start":"00:02:49,840","summary":"Explains density as the ratio of mass to volume, measured in kg/m\u00b3. Describes density as how crowded or packed something is, using examples like water having 1000 kg/m\u00b3 density.","title":"Explaining Density Concept"},{"end":"00:04:04,039","relevance_score":5,"start":"00:03:15,040","summary":"Compares densities of different materials, with water at 1 g/cm\u00b3 and iron at 7.8 g/cm\u00b3. Explains how density remains uniform within same materials regardless of size.","title":"Density Examples Comparison"},{"end":"00:04:59,199","relevance_score":4,"start":"00:04:04,039","summary":"Discusses how air density varies with altitude, from 0.1 g/cm\u00b3 at surface to 0.004 g/cm\u00b3 at 10km altitude. Explains why density decreases with height due to atmospheric pressure.","title":"Air Density Variation"},{"end":"00:11:12,360","relevance_score":4,"start":"00:10:24,720","summary":"Explains how water's density changes with temperature, reaching maximum density at 4\u00b0C. Details how cooling affects molecular arrangement and density.","title":"Water Density Temperature Relationship"},{"end":"00:08:55,120","relevance_score":3,"start":"00:08:12,400","summary":"Demonstrates how density determines whether objects float or sink in fluids. Objects with lower density than the fluid float, while those with higher density sink.","title":"Density and Flotation"}],"total_segments":5,"video_id":"AJxYCosjRH0","youtube_url":"https://www.youtube.com/watch?v=AJxYCosjRH0"};
              setVideo(d);              

            // });
          }}>Submit</Button>
          
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}

const VIDEO_OPTIONS = {
  width: 640,
  height: 360,
}

export default function Home() {
  const [state, setState] = useState({
    sidebar: true,
    // newVideo: false,
    findVideo: false,
  });
  const [video, setVideo] = useState(null);
  const playerRef = useRef(null);

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
              <NewVideoPopover setVideo={setVideo}>
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
              <NewVideoPopover setVideo={setVideo}>
                <PlusIcon className="cursor-pointer" />
              </NewVideoPopover>
              <MagnifyingGlassIcon className="cursor-pointer" onClick={findVideo} />
            </Flex>
          )}
        </Box>

        <Separator orientation="vertical" size="4" />

        <Box>
          {/* <Grid height="48px" align="center" columns="3" className="mx-5">
            <Text>test</Text>
          </Grid> */}

          {video ? (
            <Flex width="100%" height="100%" p="16px" gap="2">
              <Flex width="100%" gap="2" direction="column">
                <YouTube videoId={video.video_id} onReady={e => {
                  playerRef.current = e.target;
                }} opts={{
                  width: `${VIDEO_OPTIONS.width}`,
                  height: `${VIDEO_OPTIONS.height}`,
                  playerVars: {
                    autoplay: 1,
                  }
                }} />

                {/* transcript */}
              </Flex>

              <ScrollArea className="h-[100vh] flex-grow">
                <Heading mb="2" className="text-center">{`${video.total_segments} segments`}</Heading>
                <Flex direction="column" gap="2">
                  {video.segments.map(s => <Card key={crypto.randomUUID()}>
                    {s.title}
                  </Card>)}
                </Flex>
              </ScrollArea>
            </Flex>
          ) : (
            null
          )}
    
        </Box>

      </Grid>
    </>
  );
}
