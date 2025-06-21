'use client';

import { Box, Button, Card, Flex, Separator } from "@radix-ui/themes";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function Home() {
  return (
    <PanelGroup direction="horizontal" className="w-full h-full">
      <Panel>
        <Card>
          
        </Card>
      </Panel>
      <PanelResizeHandle className="w-2">
        {/* <Separator orientation="vertical" className="h-full" /> */}
      </PanelResizeHandle>
      <Panel>
        <Card>
          
        </Card>
      </Panel>
    </PanelGroup>
  );
}
