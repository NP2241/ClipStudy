'use client';

import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon, ViewVerticalIcon } from "@radix-ui/react-icons";
import { Box, Button, Card, Code, Dialog, Flex, Grid, Heading, Popover, ScrollArea, Separator, Strong, Text, TextField, VisuallyHidden } from "@radix-ui/themes";
import Image from "next/image";
import React, { useRef, useState } from "react";
import YouTube from "react-youtube";
import { useInterval } from "usehooks-ts";
import logo from '../../public/logo.png';




function Logo() {
  // return <Text className="flex-grow">Logo</Text>;
  return (
    <Box className="flex-grow">
      <Image src={logo} height={35} alt="logo" />
    </Box>
  );
}

function NewVideoPopover({children, setVideo}) {
  const [url, setUrl] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={v => setOpen(v)} >
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

          {/* <Popover.Close> */}
            <Button loading={loading} mt="2" onClick={() => {
              setLoading(true);
              fetch(`/api/get/${encodeURIComponent((new URL(url)).searchParams.get('v'))}?prompt=${encodeURIComponent(search)}`)
              .then(r => r.json())
              .then(d => {

                d.transcript_parsed = d.transcript.split('\n\n').map((s, i) => {
                  let a = s.split('\n');
                  return {
                    id: i,
                    range: a[0],
                    starts: parseTime(a[0].substring(0, a[0].indexOf(' '))),
                    ends: parseTime(a[0].substring(a[0].lastIndexOf(' ') + 1)),
                    text: a[1],
                  };
                });
                d.segments = d.segments.map(s => ({...s, starts: parseTime(s.start), ends: parseTime(s.end)}));

  //               console.log(transcriptParser.fromSrt(String.raw`00:00:00,160 --> 00:00:06,630
  // metals like iron and nickel whereas the crust the outer thin crust is made of

  // 00:00:06,630 --> 00:00:08,629
  // crust the outer thin crust is made of the lighter silicates why is it like

  // 00:00:08,629 --> 00:00:10,350
  // the lighter silicates why is it like that why are the heavy stuff close to

  // 00:00:10,350 --> 00:00:13,430
  // the center whereas the lighter ones are closer to the surface and if you
  // `))

                setVideo(d);        

                setLoading(false);
                setOpen(false);
              });
            }}>Submit</Button>
          {/* </Popover.Close> */}
          
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}

const VIDEO_OPTIONS = {
  width: 640,
  height: 360,
};
const relevanceColor = ['#000000', '#CE2C31', '#CC4E00', '#FFDC00', '#B0E64C', '#2A7E3B'];



function parseTime(str) {
  const [hours, minutes, rest] = str.split(':');
  const [seconds, milliseconds] = rest.split(',');

  return (
    parseInt(hours) * 3600 +
    parseInt(minutes) * 60 +
    parseInt(seconds) +
    parseInt(milliseconds) / 1000
  );
}

export default function Home() {
  const [state, setState] = useState({
    sidebar: true,
    // newVideo: false,
    findVideo: false,
    openSegments: {

    },
    // playing: false,
  });
  const [video, setVideoRaw] = useState(null);
  const playerRef = useRef(null);

  // function newVideo() {
  //   setState({...state, newVideo: true});
  // }
  function findVideo() {
    setState({...state, findVideo: true});
  }

  const [currentTime, setCurrentTime] = useState(0);

  const [videos, setVideos] = useState([]);

  function setVideo(newVideo) {
    setVideos([newVideo, ...videos]);
    setVideoRaw(newVideo);
  }

  useInterval(() => {
    if (playerRef.current && playerRef.current.getPlayerState() !== 2) {
      const currentTime = playerRef.current.getCurrentTime();
      setCurrentTime(currentTime);

      let v = video.transcript_parsed.find(t => (t.starts <= currentTime && currentTime <= t.ends));
      if (v) {
        // console.log(document.getElementById(`transcript${v.id}`))
        document.getElementById(`transcript${v.id}`)?.scrollIntoView();
      }
    }
  }, 0);

  const [search, setSearch] = useState('');

  return (
    <>
      {/* <Dialog.Root open={state.newVideo} onOpenChange={v => setState({...state, newVideo: v})}>
        <Dialog.Content>
          <Dialog.Title>New video</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root> */}

      <Dialog.Root open={state.findVideo} onOpenChange={v => setState({...state, findVideo: v})}>
        <Dialog.Content width="400px">
          <VisuallyHidden><Dialog.Title></Dialog.Title></VisuallyHidden>
          <TextField.Root value={search} onChange={e => setSearch(e.target.value)} onBlur={() => setState({...state, findVideo: false})} size="3" placeholder="Search videos..." autoFocus></TextField.Root>        
          <Flex mt="2" direction="column" gap="2">
            <NewVideoPopover setVideo={setVideo}>
              <Button variant="soft">
                <PlusIcon />
                New video
              </Button>
            </NewVideoPopover>
            
            <Separator size="4" />

            {videos.filter(v => v.query.toLowerCase().includes(search.toLowerCase())).map(v => <Button key={crypto.randomUUID()} variant="soft" onClick={() => {
              setVideoRaw(v);
              setState({...state, findVideo: false});
              setSearch('');
            }}>{v.query}</Button>)}
          </Flex>  
        </Dialog.Content>
      </Dialog.Root>

      <Grid columns={state.sidebar ? '20% auto 80%' : '55px auto calc(100% - 55px)'} width="calc(100% - 1px)" height="100vh">
        <ScrollArea size="2" type="auto">
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

                <Text mt="4">Videos</Text>
                {videos.map(v => <Button key={crypto.randomUUID()} variant="soft" onClick={() => {
                  setVideoRaw(v);
                }}>{v.query}</Button>)}
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
        </ScrollArea>

        <Separator orientation="vertical" size="4" />

        <Box>
          {/* <Grid height="48px" align="center" columns="3" className="mx-5">
            <Text>test</Text>
          </Grid> */}

          {video ? (
            <Flex width="100%" height="100%" px="16px" pt="16px" gap="2">
              <Flex width="100%" direction="column">
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
                <ScrollArea style={{height: `calc(100vh - 16px - ${VIDEO_OPTIONS.height}px)`}} size="2" type="auto">
                  <Box height="4px" />
                  <Flex direction="column" gap="2" mr="4">
                    {video.transcript_parsed.map(t => <Box key={t.id} id={`transcript${t.id}`}>
                      {/* {t.range + '\n' + t.text} */}
                      <Code>{t.range}<br /></Code>
                      <Text>
                        {(t.starts <= currentTime && currentTime <= t.ends) ? (
                          <Strong>{t.text}</Strong>
                        ) : (
                          t.text
                        )}
                      </Text>
                    </Box>)}
                  </Flex>
                </ScrollArea>
              </Flex>

              {/* <ScrollArea className="h-[100vh] flex-grow" size="2"> */}
              <ScrollArea style={{height: `calc(100vh - 16px)`}} size="2" type="auto">
                <Flex direction="column" gap="2" mr="4">
                  <Heading className="text-center">{`${video.total_segments} relevant segments`}</Heading>
                  {video.segments.map((s, i) => <Card key={i} className={state.openSegments[i] ? '' : 'cursor-pointer'} onClick={() => {
                    if (!state.openSegments[i]) {
                      // console.log(playerRef.current);
                      // console.log(s)
                      // console.log(s.start)
                      let t = playerRef.current.getCurrentTime();
                      if (s.starts <= t && t <= s.ends) {

                      } else {
                        playerRef.current.seekTo(s.starts);
                      }
                    }
                    
                    setState({...state, openSegments: {...state.openSegments, [i]: !state.openSegments[i]}})
                  }}>
                    <Flex align="center" gap="2">
                      {state.openSegments[i] ? <ChevronLeftIcon width="20px" height="20px" /> : <ChevronRightIcon width="20px" height="20px" />}
                      <Text className="flex-grow">
                        {(s.starts <= currentTime && currentTime <= s.ends) ? (
                          <Strong>{s.title}</Strong>
                        ) : (
                          s.title
                        )}
                      </Text>
                      <Text style={{color: relevanceColor[s.relevance_score]}}>{s.relevance_score}</Text>
                    </Flex>
                    {state.openSegments[i] ? (
                      <Flex mt="1" gap="2" direction="column">
                        <Text size="2">{s.summary}</Text>
                        <Box>
                          <Code>{`${s.start} --> ${s.end}`}</Code>
                        </Box>
                      </Flex>
                    ) : null}
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
