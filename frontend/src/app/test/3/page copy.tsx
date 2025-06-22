'use client';

import { Box, Button, Card, Container, Flex, Grid, ScrollArea, Separator } from "@radix-ui/themes";
import { useState } from "react";

export default function Home() {
  const [chat, setChat] = useState({
    messages: [
      {
        type: 'user',
        content: 'testuser',
      },
      {
        type: 'ai',
        content: 'testanswer',
      }
    ],
  });

  return (
    <Grid columns="20% auto 80%" width="calc(100% - 1px)" height="screen">
      <Box height="screen">1</Box>
      <Separator orientation="vertical" size="4" />
      {/* <Box>2</Box> */}
      <Box height="screen">
        <Grid height="48px" align="center" columns="3" className="mx-5">
          test
        </Grid>
        <Separator size="4" />

        {/* <ScrollArea scrollbars="vertical" className="h-[calc(100px)]" type="always"> */}
        {/* <ScrollArea scrollbars="vertical" className="h-[calc(100vh)]" type="always">
          <Box className="relative h-[calc(100vh)] px-40">
            <Box height="24px" />
            <Flex direction="column" gap="3">
              {chat.messages.map(message => <Card key={crypto.randomUUID()}>{message}</Card>)}
            </Flex>
          </Box>
        </ScrollArea> */}

        <Box height="calc(100vh - 49px)" overflowY="auto">
          <Flex direction="column" gap="3" className="px-40">
            <Box height="24px" />
            {chat.messages.map(m => <Flex key={crypto.randomUUID()} justify={m.type == 'user' ? 'end' : 'start'}>
              <Card>
                {m.content}
              </Card>
            </Flex>)}
          </Flex>
        </Box>
      </Box>

    </Grid>
  );
}
