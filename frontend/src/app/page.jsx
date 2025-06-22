'use client';

import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon, ViewVerticalIcon } from "@radix-ui/react-icons";
import { Box, Button, Card, Code, Dialog, Flex, Grid, Heading, Popover, ScrollArea, Separator, Strong, Text, TextField, VisuallyHidden } from "@radix-ui/themes";
import Image from "next/image";
import React, { useRef, useState } from "react";
import YouTube from "react-youtube";
import { useInterval } from "usehooks-ts";





function Logo() {
  // return <Text className="flex-grow">Logo</Text>;
  return <Image src />
}

function NewVideoPopover({children, setVideo}) {
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

          <Popover.Close>
            <Button mt="2" onClick={() => {
              fetch(`/api/get/${encodeURIComponent((new URL(url)).searchParams.get('v'))}?prompt=${encodeURIComponent(search)}`)
              .then(r => r.json())
              .then(d => {
                // hardcoded for now


                // let d = {"query":"density","segments":[{"end":"00:03:22,430","relevance_score":5,"start":"00:02:49,830","summary":"Density is explained as the ratio of mass to volume, measured in kg/m\u00b3. It represents how crowded or packed something is, with examples given for water (1000 kg/m\u00b3) and iron (7.8 g/cm\u00b3).","title":"Definition of Density"},{"end":"00:08:55,110","relevance_score":5,"start":"00:08:16,390","summary":"Objects with lower density than water tend to float, while those with higher density sink. This principle explains why oil floats on water and iron sinks.","title":"Density and Floating"},{"end":"00:10:50,629","relevance_score":4,"start":"00:10:20,990","summary":"The density of water varies with temperature, reaching maximum density at 4\u00b0C at 1 g/cm\u00b3. As temperature decreases, molecules generally come closer together, increasing density.","title":"Temperature Effects on Density"},{"end":"00:06:11,270","relevance_score":4,"start":"00:05:49,790","summary":"The density of air varies with altitude due to the weight of the atmosphere above. Lower layers experience more pressure, resulting in higher density at lower altitudes.","title":"Air Density Variation"},{"end":"00:07:09,550","relevance_score":3,"start":"00:06:46,589","summary":"Unlike gases, water is nearly incompressible, maintaining consistent density despite high pressure variations in oceans. Even extreme pressures at ocean depths don't significantly change water's density.","title":"Water Density Properties"}],"total_segments":5,"transcript":"00:00:00,160 --> 00:00:06,630\nmetals like iron and nickel whereas the crust the outer thin crust is made of\n\n00:00:06,630 --> 00:00:08,629\ncrust the outer thin crust is made of the lighter silicates why is it like\n\n00:00:08,629 --> 00:00:10,350\nthe lighter silicates why is it like that why are the heavy stuff close to\n\n00:00:10,350 --> 00:00:13,430\nthe center whereas the lighter ones are closer to the surface and if you\n\n00:00:13,430 --> 00:00:15,709\ncloser to the surface and if you consider extremely cold places like say\n\n00:00:15,709 --> 00:00:17,670\nconsider extremely cold places like say Antarctica the average temperature over\n\n00:00:17,670 --> 00:00:21,150\nAntarctica the average temperature over there is close to- 50\u00b0 C which is very\n\n00:00:21,150 --> 00:00:24,150\nthere is close to- 50\u00b0 C which is very below the freezing point of water and\n\n00:00:24,150 --> 00:00:29,029\nyet for some reason the oceans and the lakes do not freeze over there and\n\n00:00:29,029 --> 00:00:31,550\nlakes do not freeze over there and that's why aquatic light survives but\n\n00:00:31,550 --> 00:00:34,190\nthat's why aquatic light survives but why don't they freeze well to answer\n\n00:00:34,190 --> 00:00:35,790\nwhy don't they freeze well to answer this question we need to dig deeper into\n\n00:00:35,790 --> 00:00:38,069\nthis question we need to dig deeper into the idea of fluids and densities and\n\n00:00:38,069 --> 00:00:39,389\nthe idea of fluids and densities and that's what we want to do in this video\n\n00:00:39,389 --> 00:00:44,910\nso let's begin so what exactly are fluids fluids are substances that flow\n\n00:00:44,910 --> 00:00:49,830\nand they do that because they don't have a fixed shape so think about liquids and\n\n00:00:49,830 --> 00:00:52,229\na fixed shape so think about liquids and gases collectively we call them fluids\n\n00:00:52,229 --> 00:00:54,150\ngases collectively we call them fluids and if you consider our planet the most\n\n00:00:54,150 --> 00:00:55,549\nand if you consider our planet the most of the surface of the planet is covered\n\n00:00:55,549 --> 00:00:58,349\nof the surface of the planet is covered with liquid water that is a fluid\n\n00:00:58,349 --> 00:01:00,630\nwith liquid water that is a fluid because water can flow rivers and all\n\n00:01:00,630 --> 00:01:03,389\nbecause water can flow rivers and all flow and what about our atmosphere well\n\n00:01:03,389 --> 00:01:07,950\nit's air which is a gas which is also a fluid because again we know that it\n\n00:01:07,950 --> 00:01:10,670\nfluid because again we know that it flows giving us air currents and breezes\n\n00:01:10,670 --> 00:01:13,190\nflows giving us air currents and breezes and storms and whatnot in contrast if\n\n00:01:13,190 --> 00:01:14,830\nand storms and whatnot in contrast if you consider the Solid Surfaces over\n\n00:01:14,830 --> 00:01:21,069\nhere they do not flow because they have a fixed shape now of course over very\n\n00:01:21,069 --> 00:01:23,270\na fixed shape now of course over very large time scales they too can flow\n\n00:01:23,270 --> 00:01:25,590\nlarge time scales they too can flow because of geological processes but\n\n00:01:25,590 --> 00:01:27,310\nbecause of geological processes but we're going to ignore that okay solids\n\n00:01:27,310 --> 00:01:29,310\nwe're going to ignore that okay solids do not flow because they have a fixed\n\n00:01:29,310 --> 00:01:30,429\ndo not flow because they have a fixed shape but\n\n00:01:30,429 --> 00:01:32,950\nshape but why why do solids have a fixed shape to\n\n00:01:32,950 --> 00:01:34,030\nwhy why do solids have a fixed shape to answer that question we need to zoom in\n\n00:01:34,030 --> 00:01:35,510\nanswer that question we need to zoom in at the atomic or the molecular level if\n\n00:01:35,510 --> 00:01:37,310\nat the atomic or the molecular level if you could zoom into a solid like for\n\n00:01:37,310 --> 00:01:40,830\nexample ice the molecules experience a force of attraction that makes them\n\n00:01:40,830 --> 00:01:45,469\nstick to each other but they also have a thermal motion which makes them move\n\n00:01:45,469 --> 00:01:52,230\nthermal motion is low enough that the attraction vins and as a result\n\n00:01:52,230 --> 00:01:54,069\nattraction vins and as a result molecules and atoms end up sticking to\n\n00:01:54,069 --> 00:01:56,149\nmolecules and atoms end up sticking to each other giving them a particular\n\n00:01:56,149 --> 00:02:00,510\nshape however when you consider the liquid phase of that same substance\n\n00:02:00,510 --> 00:02:02,350\nliquid phase of that same substance the temperatures are relatively higher\n\n00:02:02,350 --> 00:02:04,149\nthe temperatures are relatively higher so thermal motions are relatively higher\n\n00:02:04,149 --> 00:02:07,709\nhigh enough to partially overcome the attraction because of which they no\n\n00:02:07,709 --> 00:02:10,270\nattraction because of which they no longer are able to retain the shape\n\n00:02:10,270 --> 00:02:13,710\nthat's why liquids tend to take the shape of the container and what about\n\n00:02:13,710 --> 00:02:15,550\nshape of the container and what about the gas phase well here the thermal\n\n00:02:15,550 --> 00:02:17,430\nthe gas phase well here the thermal motion is so high that it completely\n\n00:02:17,430 --> 00:02:19,190\nmotion is so high that it completely overcomes the attractive forces because\n\n00:02:19,190 --> 00:02:20,589\novercomes the attractive forces because of which the particles are pretty much\n\n00:02:20,589 --> 00:02:23,150\nof which the particles are pretty much moving freely so look in liquids and\n\n00:02:23,150 --> 00:02:26,110\ngases the thermal motion of the molecules can overcome the attractive\n\n00:02:26,110 --> 00:02:29,910\nmolecules can overcome the attractive forces that makes them flow all right so\n\n00:02:29,910 --> 00:02:32,949\nforces that makes them flow all right so the fluids flow what's the big deal well\n\n00:02:32,949 --> 00:02:35,030\nthe fluids flow what's the big deal well the big deal is because they flow when\n\n00:02:35,030 --> 00:02:37,150\nthe big deal is because they flow when you mix two different fluids or a fluid\n\n00:02:37,150 --> 00:02:40,470\nyou mix two different fluids or a fluid and a solid they can sink or float and\n\n00:02:40,470 --> 00:02:44,470\nthat has a huge consequence as we will see but what decides whether something\n\n00:02:44,470 --> 00:02:49,830\nsinks or floats well that depends on an important property called density you\n\n00:02:49,830 --> 00:02:52,990\nimportant property called density you can think of density as a ratio of mass\n\n00:02:52,990 --> 00:02:55,750\ncan think of density as a ratio of mass and volume so the standard unit for\n\n00:02:55,750 --> 00:02:57,430\nand volume so the standard unit for density would be well mass is in\n\n00:02:57,430 --> 00:02:59,990\ndensity would be well mass is in kilograms and volume would be meter cube\n\n00:02:59,990 --> 00:03:01,670\nkilograms and volume would be meter cube so density's standard units would be\n\n00:03:01,670 --> 00:03:04,830\nso density's standard units would be kilog per M Cube but what exactly does\n\n00:03:04,830 --> 00:03:07,149\nkilog per M Cube but what exactly does it represent well think about density as\n\n00:03:07,149 --> 00:03:09,630\nit represent well think about density as a measure of how crowded something is or\n\n00:03:09,630 --> 00:03:11,550\na measure of how crowded something is or how packed something is you know how\n\n00:03:11,550 --> 00:03:15,030\nhow packed something is you know how much mass is packed in a unit volume how\n\n00:03:15,030 --> 00:03:18,229\nmuch mass is packed in a unit volume how many kilograms are packed in a m Cube or\n\n00:03:18,229 --> 00:03:19,710\nmany kilograms are packed in a m Cube or you know a more convenient unit would be\n\n00:03:19,710 --> 00:03:22,430\nyou know a more convenient unit would be how many grams are packed in a centime\n\n00:03:22,430 --> 00:03:25,070\nhow many grams are packed in a centime cube whatever it is it's a measure of\n\n00:03:25,070 --> 00:03:26,670\ncube whatever it is it's a measure of how packed something is so let's take\n\n00:03:26,670 --> 00:03:28,509\nhow packed something is so let's take some examples if you take water for\n\n00:03:28,509 --> 00:03:32,110\nsome examples if you take water for example it has a den of 1,000 kg per M\n\n00:03:32,110 --> 00:03:34,509\nexample it has a den of 1,000 kg per M Cube so you can imagine a m cube of\n\n00:03:34,509 --> 00:03:37,630\nCube so you can imagine a m cube of water contains 1,000 kg of water but\n\n00:03:37,630 --> 00:03:39,509\nwater contains 1,000 kg of water but again I like to think in terms of gram\n\n00:03:39,509 --> 00:03:41,030\nagain I like to think in terms of gram per CM Cube that's more convenient so if\n\n00:03:41,030 --> 00:03:43,390\nper CM Cube that's more convenient so if you convert this you end up with 1 G per\n\n00:03:43,390 --> 00:03:45,270\nyou convert this you end up with 1 G per CM Cube the idea is the same if you now\n\n00:03:45,270 --> 00:03:51,190\ntake a CM cube of water it will have a mass of 1 g in contrast if you consider\n\n00:03:51,190 --> 00:03:55,030\nmass of 1 g in contrast if you consider ion it has a density of 7.8 G per CM\n\n00:03:55,030 --> 00:03:59,149\nion it has a density of 7.8 G per CM cube a cenm cube of ion has 7.8 G of ion\n\n00:03:59,149 --> 00:04:00,869\ncube a cenm cube of ion has 7.8 G of ion packed into it which is much higher\n\n00:04:00,869 --> 00:04:02,710\npacked into it which is much higher density compared to water and by the way\n\n00:04:02,710 --> 00:04:06,069\nif you're wondering whether this is a coincidence that the you know density of\n\n00:04:06,069 --> 00:04:11,069\nwater is exactly 1 G per CM Cube such a nice number it's not a coincidence we\n\n00:04:11,069 --> 00:04:13,509\nnice number it's not a coincidence we defined our gram this way the mass of 1\n\n00:04:13,509 --> 00:04:17,390\ndefined our gram this way the mass of 1 cm cube of Water by definition is 1 G\n\n00:04:17,390 --> 00:04:19,150\ncm cube of Water by definition is 1 G but anyways if you consider water or ion\n\n00:04:19,150 --> 00:04:22,870\nfor that matter the densities are uniform it's the same everywhere which\n\n00:04:22,870 --> 00:04:24,030\nuniform it's the same everywhere which means if you take a small amount of\n\n00:04:24,030 --> 00:04:25,830\nmeans if you take a small amount of water here or a large chunk of water\n\n00:04:25,830 --> 00:04:27,710\nwater here or a large chunk of water over here the density will be the same 1\n\n00:04:27,710 --> 00:04:31,710\nG per CM Cube similarly if you take a a small chunk of iron from here or a big\n\n00:04:31,710 --> 00:04:33,749\nsmall chunk of iron from here or a big chunk of iron from a ship for example\n\n00:04:33,749 --> 00:04:36,110\nchunk of iron from a ship for example the density would be the same 7.8 G per\n\n00:04:36,110 --> 00:04:38,830\nthe density would be the same 7.8 G per CM Cube but that's not always the case\n\n00:04:38,830 --> 00:04:40,390\nCM Cube but that's not always the case if you consider the density of the air\n\n00:04:40,390 --> 00:04:45,390\nfor example close to the surface of the Earth it is roughly about\n\n00:04:45,390 --> 00:04:48,469\nEarth it is roughly about 0.1 G per cmq you can see the density of\n\n00:04:48,469 --> 00:04:51,189\n0.1 G per cmq you can see the density of the air is much much smaller than that\n\n00:04:51,189 --> 00:04:52,550\nthe air is much much smaller than that of water it's about thousand times\n\n00:04:52,550 --> 00:04:57,150\nsmaller however if you consider the density of the air you know at say about\n\n00:04:57,150 --> 00:04:59,310\ndensity of the air you know at say about 10 km which is usually the cruising\n\n00:04:59,310 --> 00:05:00,150\n10 km which is usually the cruising altitude\n\n00:05:00,150 --> 00:05:02,310\naltitude of a commercial airline you would find\n\n00:05:02,310 --> 00:05:05,150\nof a commercial airline you would find the density even lower\n\n00:05:05,150 --> 00:05:09,550\nthe density even lower 004 approximately G per CM cub and in\n\n00:05:09,550 --> 00:05:16,909\ndensity but why well think about it this way if you consider the layer of air\n\n00:05:16,909 --> 00:05:19,029\nway if you consider the layer of air over here it's carrying the weight of\n\n00:05:19,029 --> 00:05:22,230\nover here it's carrying the weight of the atmosphere on top of it that weight\n\n00:05:22,230 --> 00:05:24,629\nthe atmosphere on top of it that weight is pushing down on the molecules over\n\n00:05:24,629 --> 00:05:27,150\nis pushing down on the molecules over here squeezing them together packing\n\n00:05:27,150 --> 00:05:28,990\nhere squeezing them together packing them together giving them a specific\n\n00:05:28,990 --> 00:05:30,950\nthem together giving them a specific density but now if you consider a layer\n\n00:05:30,950 --> 00:05:34,230\ndensity but now if you consider a layer of air that is even lower then look it's\n\n00:05:34,230 --> 00:05:36,710\nof air that is even lower then look it's carrying an additional weight compared\n\n00:05:36,710 --> 00:05:39,390\ncarrying an additional weight compared to this layer so it's carrying more\n\n00:05:39,390 --> 00:05:41,309\nto this layer so it's carrying more weight in fact the layer at the bottom\n\n00:05:41,309 --> 00:05:49,790\nmuch higher and so the molecules are squeezed together much higher packed\n\n00:05:49,790 --> 00:05:53,430\ntogether more tightly giving you a higher density and that's why the lower\n\n00:05:53,430 --> 00:05:56,390\nhigher density and that's why the lower you go higher the density but wait\n\n00:05:56,390 --> 00:05:57,909\nyou go higher the density but wait shouldn't the same be the case with\n\n00:05:57,909 --> 00:05:59,309\nshouldn't the same be the case with water as well for example if you\n\n00:05:59,309 --> 00:06:00,790\nwater as well for example if you consider the the ocean then shouldn't\n\n00:06:00,790 --> 00:06:04,629\nthe layer at the bottom of the ocean have a higher density than the layer at\n\n00:06:04,629 --> 00:06:06,670\nhave a higher density than the layer at the top of the ocean well that's a great\n\n00:06:06,670 --> 00:06:09,070\nthe top of the ocean well that's a great question but turns out not to be so\n\n00:06:09,070 --> 00:06:11,270\nquestion but turns out not to be so because of one main difference between\n\n00:06:11,270 --> 00:06:13,589\nbecause of one main difference between liquids and gases gases can be easily\n\n00:06:13,589 --> 00:06:15,390\nliquids and gases gases can be easily compressed and to demonstrate this here\n\n00:06:15,390 --> 00:06:17,350\ncompressed and to demonstrate this here is a syringe which contains only air and\n\n00:06:17,350 --> 00:06:19,350\nis a syringe which contains only air and I've sealed the top with my finger now\n\n00:06:19,350 --> 00:06:21,469\nI've sealed the top with my finger now let me try and push it and you can see I\n\n00:06:21,469 --> 00:06:24,150\nlet me try and push it and you can see I can easily compress it I have compressed\n\n00:06:24,150 --> 00:06:26,029\ncan easily compress it I have compressed the gas and I've increased the density\n\n00:06:26,029 --> 00:06:27,950\nthe gas and I've increased the density just by using my finger but now let's\n\n00:06:27,950 --> 00:06:29,189\njust by using my finger but now let's see what happens if you fill the syringe\n\n00:06:29,189 --> 00:06:30,309\nsee what happens if you fill the syringe with water\n\n00:06:30,309 --> 00:06:32,270\nwith water again seal the top with my finger and\n\n00:06:32,270 --> 00:06:35,150\nagain seal the top with my finger and now if I'm pushing it no look it's I\n\n00:06:35,150 --> 00:06:37,830\nnow if I'm pushing it no look it's I can't compress it even a little bit I am\n\n00:06:37,830 --> 00:06:40,950\ncan't compress it even a little bit I am pushing as hard as I can it's just not\n\n00:06:40,950 --> 00:06:46,589\npossible so this means liquids are extremely hard to compress and because\n\n00:06:46,589 --> 00:06:48,469\nextremely hard to compress and because you can't compress them you can't\n\n00:06:48,469 --> 00:06:50,309\nyou can't compress them you can't squeeze the molecules closer and you\n\n00:06:50,309 --> 00:06:52,309\nsqueeze the molecules closer and you can't increase the density and so that's\n\n00:06:52,309 --> 00:06:56,510\nwhy even though at the bottom the pressures are insanely High compared to\n\n00:06:56,510 --> 00:06:59,189\nthe top of the oceans in fact the pressures at the bottom are so high that\n\n00:06:59,189 --> 00:07:01,550\npressures at the bottom are so high that even submarines can get crushed but\n\n00:07:01,550 --> 00:07:04,469\neven submarines can get crushed but because compressing water is extremely\n\n00:07:04,469 --> 00:07:06,189\nbecause compressing water is extremely difficult the molecules will not come\n\n00:07:06,189 --> 00:07:07,950\ndifficult the molecules will not come any closer than they are at the top and\n\n00:07:07,950 --> 00:07:09,550\nany closer than they are at the top and as a result the density is pretty much\n\n00:07:09,550 --> 00:07:18,589\nmodel water as an ideal fluid which is in compressible I mean technically you\n\n00:07:18,589 --> 00:07:21,670\nin compressible I mean technically you can compress water if you put horrendous\n\n00:07:21,670 --> 00:07:23,909\ncan compress water if you put horrendous amounts of forces but since we're not\n\n00:07:23,909 --> 00:07:26,230\namounts of forces but since we're not dealing with such high forces usually we\n\n00:07:26,230 --> 00:07:28,990\ndealing with such high forces usually we can model it to be incompressible so\n\n00:07:28,990 --> 00:07:31,830\ncan model it to be incompressible so ideal fluids are incompressible and they\n\n00:07:31,830 --> 00:07:34,029\nideal fluids are incompressible and they also have no viscosity what does that\n\n00:07:34,029 --> 00:07:36,869\nalso have no viscosity what does that mean well some fluids can be very thick\n\n00:07:36,869 --> 00:07:38,710\nmean well some fluids can be very thick making them very hard to flow think\n\n00:07:38,710 --> 00:07:41,309\nmaking them very hard to flow think about ketchup or honey for example\n\n00:07:41,309 --> 00:07:44,189\nabout ketchup or honey for example because of their thickness or viscosity\n\n00:07:44,189 --> 00:07:46,629\nbecause of their thickness or viscosity it can produce resistance to motion but\n\n00:07:46,629 --> 00:07:49,230\nit can produce resistance to motion but if we dealing with ideal fluids we model\n\n00:07:49,230 --> 00:07:51,029\nif we dealing with ideal fluids we model them by saying that hey ideal fluids\n\n00:07:51,029 --> 00:07:52,909\nthem by saying that hey ideal fluids have no viscosity at all all right now\n\n00:07:52,909 --> 00:07:54,510\nhave no viscosity at all all right now let's try to explore why stuff sinks or\n\n00:07:54,510 --> 00:07:58,390\nfloats when we mix fluids or fluid in a solid so let's see what happens when you\n\n00:07:58,390 --> 00:08:00,710\nsolid so let's see what happens when you mix water and oil what we notice is that\n\n00:08:00,710 --> 00:08:03,390\nmix water and oil what we notice is that if you allow them to settle oil Floats\n\n00:08:03,390 --> 00:08:05,790\nif you allow them to settle oil Floats or you could say that water sinks but\n\n00:08:05,790 --> 00:08:07,790\nor you could say that water sinks but why well first of all we can easily\n\n00:08:07,790 --> 00:08:10,510\nmodel them as ideal fluids because the density is pretty much the same\n\n00:08:10,510 --> 00:08:16,390\nthat oil has a density that's less than that of water so stuff that has less\n\n00:08:16,390 --> 00:08:18,950\nthat of water so stuff that has less density tends to float or you could say\n\n00:08:18,950 --> 00:08:20,790\ndensity tends to float or you could say that water has a density more than that\n\n00:08:20,790 --> 00:08:23,029\nthat water has a density more than that of oil and therefore it sinks stuff that\n\n00:08:23,029 --> 00:08:25,550\nof oil and therefore it sinks stuff that has more density tends to sink let's\n\n00:08:25,550 --> 00:08:28,029\nhas more density tends to sink let's take another example if you put an iron\n\n00:08:28,029 --> 00:08:31,070\ntake another example if you put an iron bolt in in water it sinks why because we\n\n00:08:31,070 --> 00:08:32,790\nbolt in in water it sinks why because we already saw ion has a much higher\n\n00:08:32,790 --> 00:08:35,509\nalready saw ion has a much higher density than water what about ice ice\n\n00:08:35,509 --> 00:08:38,350\ndensity than water what about ice ice floats on water because it has a less\n\n00:08:38,350 --> 00:08:40,790\nfloats on water because it has a less density than water here's another way to\n\n00:08:40,790 --> 00:08:42,949\ndensity than water here's another way to think about it here the gravitational\n\n00:08:42,949 --> 00:08:45,470\nthink about it here the gravitational field is acting downwards isn't it so\n\n00:08:45,470 --> 00:08:46,990\nfield is acting downwards isn't it so stuff which has more density tends to\n\n00:08:46,990 --> 00:08:50,310\nmove in the direction of the gravitational field sinking and stuff\n\n00:08:50,310 --> 00:08:52,750\ngravitational field sinking and stuff that has less density tends to move\n\n00:08:52,750 --> 00:08:55,110\nthat has less density tends to move against the gravitational field what's\n\n00:08:55,110 --> 00:09:02,269\nflotation or Sinking and it's for the same reason why helium balloons tend to\n\n00:09:02,269 --> 00:09:04,350\nsame reason why helium balloons tend to move up because they have a density\n\n00:09:04,350 --> 00:09:06,870\nmove up because they have a density that's less than the surrounding air and\n\n00:09:06,870 --> 00:09:11,790\ntherefore they move up against the gravitational field okay now let's see\n\n00:09:11,790 --> 00:09:13,069\ngravitational field okay now let's see if we can use this to explain our\n\n00:09:13,069 --> 00:09:14,949\nif we can use this to explain our original question about the Earth when\n\n00:09:14,949 --> 00:09:19,350\nthe earth was formed we beli that it was highly molten and so we can model them\n\n00:09:19,350 --> 00:09:22,949\nhighly molten and so we can model them as a you know as an ideal fluid now in\n\n00:09:22,949 --> 00:09:25,990\nas a you know as an ideal fluid now in this fluid the gravitational field acts\n\n00:09:25,990 --> 00:09:31,069\ntowards the center so stuff that is having a high density like iron and\n\n00:09:31,069 --> 00:09:36,310\nnickel they will tend to move along the gravitational field sinking and\n\n00:09:36,310 --> 00:09:39,470\ngravitational field sinking and eventually settling towards the core on\n\n00:09:39,470 --> 00:09:41,630\neventually settling towards the core on the other hand stuff that has lighter\n\n00:09:41,630 --> 00:09:45,750\nyou know lower density like the silicates for example tend to move\n\n00:09:45,750 --> 00:09:51,150\nagainst the gravitational field they had to float and that's why they settle near\n\n00:09:51,150 --> 00:09:52,949\nto float and that's why they settle near the surface and that's why eventually\n\n00:09:52,949 --> 00:09:57,350\nwhen this molten rock cool to form the Earth the core ended up having high\n\n00:09:57,350 --> 00:09:59,750\nEarth the core ended up having high density heavy metals and the crust ends\n\n00:09:59,750 --> 00:10:02,910\ndensity heavy metals and the crust ends up having the silicates amazing isn't it\n\n00:10:02,910 --> 00:10:05,269\nup having the silicates amazing isn't it finally we go back to water we know that\n\n00:10:05,269 --> 00:10:07,509\nfinally we go back to water we know that ice floats on water but that's a little\n\n00:10:07,509 --> 00:10:09,269\nice floats on water but that's a little weird if you think about it because\n\n00:10:09,269 --> 00:10:11,750\nweird if you think about it because whenever you cool something the molecule\n\n00:10:11,750 --> 00:10:13,790\nwhenever you cool something the molecule tends to have less thermal motion\n\n00:10:13,790 --> 00:10:15,110\ntends to have less thermal motion because of which they tend to come\n\n00:10:15,110 --> 00:10:18,269\nbecause of which they tend to come closer together so the density actually\n\n00:10:18,269 --> 00:10:20,990\ncloser together so the density actually increases when you cool stuff generally\n\n00:10:20,990 --> 00:10:22,710\nincreases when you cool stuff generally okay that kind of makes sense right so\n\n00:10:22,710 --> 00:10:25,030\nokay that kind of makes sense right so in reality density depends on\n\n00:10:25,030 --> 00:10:26,790\nin reality density depends on temperature and the same thing works for\n\n00:10:26,790 --> 00:10:29,110\ntemperature and the same thing works for water as you cool down water its density\n\n00:10:29,110 --> 00:10:32,389\nwater as you cool down water its density will will keep increasing until we reach\n\n00:10:32,389 --> 00:10:38,910\n4\u00b0 C guess what turns out that water has a maximum density at 4\u00b0 C and that\n\n00:10:38,910 --> 00:10:41,710\na maximum density at 4\u00b0 C and that maximum density is 1 G per cmq so we\n\n00:10:41,710 --> 00:10:43,750\nmaximum density is 1 G per cmq so we should have actually told you know that\n\n00:10:43,750 --> 00:10:45,790\nshould have actually told you know that the water's density is 1 G per CM Cube\n\n00:10:45,790 --> 00:10:47,670\nthe water's density is 1 G per CM Cube or 1,000 kg per M Cube whatever you want\n\n00:10:47,670 --> 00:10:50,629\nor 1,000 kg per M Cube whatever you want to think of it as at 4\u00b0 C because\n\n00:10:50,629 --> 00:10:52,750\nto think of it as at 4\u00b0 C because density does depend on temperature but\n\n00:10:52,750 --> 00:10:54,389\ndensity does depend on temperature but wait what happens if you cool down water\n\n00:10:54,389 --> 00:10:59,750\nbelow 4\u00b0 C well now molecules will have such low thermal energy that they lock\n\n00:10:59,750 --> 00:11:02,190\nsuch low thermal energy that they lock in places and look in doing so they\n\n00:11:02,190 --> 00:11:05,350\nin places and look in doing so they start forming gaps in between which\n\n00:11:05,350 --> 00:11:08,509\nstart forming gaps in between which reduces the overall density and that's\n\n00:11:08,509 --> 00:11:12,350\nreduces the overall density and that's why density tends to decrease below 4\u00b0 C\n\n00:11:12,350 --> 00:11:14,230\nwhy density tends to decrease below 4\u00b0 C and eventually as water crystallizes\n\n00:11:14,230 --> 00:11:16,670\nand eventually as water crystallizes into ice ice ends up having lower\n\n00:11:16,670 --> 00:11:19,190\ninto ice ice ends up having lower density than water and therefore ends up\n\n00:11:19,190 --> 00:11:21,590\ndensity than water and therefore ends up floating and this has a huge consequence\n\n00:11:21,590 --> 00:11:23,710\nfloating and this has a huge consequence on the Aquatic Life in really really\n\n00:11:23,710 --> 00:11:26,150\non the Aquatic Life in really really cool places so if we go back to our\n\n00:11:26,150 --> 00:11:28,509\ncool places so if we go back to our Antarctica for example we can model\n\n00:11:28,509 --> 00:11:30,350\nAntarctica for example we can model Water by considering three different\n\n00:11:30,350 --> 00:11:31,990\nWater by considering three different layers okay let's say the current\n\n00:11:31,990 --> 00:11:34,910\nlayers okay let's say the current temperature is about 60\u00b0 C okay now what\n\n00:11:34,910 --> 00:11:37,269\ntemperature is about 60\u00b0 C okay now what if the temperature outside reduces to 5\u00b0\n\n00:11:37,269 --> 00:11:41,829\nCelsius what's going to happen well the surface of the water which is in direct\n\n00:11:41,829 --> 00:11:46,069\ncontact with the surrounding that is first going to lose heat and as a result\n\n00:11:46,069 --> 00:11:48,550\nfirst going to lose heat and as a result reduce its temperature to 5\u00b0 C now\n\n00:11:48,550 --> 00:11:50,870\nreduce its temperature to 5\u00b0 C now because it is colder it has a higher\n\n00:11:50,870 --> 00:11:53,389\nbecause it is colder it has a higher density and as a result it will sink\n\n00:11:53,389 --> 00:11:56,590\ndensity and as a result it will sink below the other layers and now this one\n\n00:11:56,590 --> 00:12:00,110\nbelow the other layers and now this one will you know cool down to 5\u00b0 C it gets\n\n00:12:00,110 --> 00:12:05,870\nsink and eventually the last layer will come on top so this is how we can model\n\n00:12:05,870 --> 00:12:08,470\ncome on top so this is how we can model how extremely large water bodies cool\n\n00:12:08,470 --> 00:12:10,110\nhow extremely large water bodies cool down now if the temperature gets lower\n\n00:12:10,110 --> 00:12:12,550\ndown now if the temperature gets lower to say 4\u00b0 C again the same thing repeats\n\n00:12:12,550 --> 00:12:15,269\nto say 4\u00b0 C again the same thing repeats and the whole ocean now is at 4\u00b0 C but\n\n00:12:15,269 --> 00:12:18,710\nand the whole ocean now is at 4\u00b0 C but at 4\u00b0 C remember we have maximum density\n\n00:12:18,710 --> 00:12:20,990\nat 4\u00b0 C remember we have maximum density now if the saring temperature goes below\n\n00:12:20,990 --> 00:12:24,150\nnow if the saring temperature goes below 4\u00b0 C let's say 3\u00b0 C again the top layer\n\n00:12:24,150 --> 00:12:25,870\n4\u00b0 C let's say 3\u00b0 C again the top layer will go down to 3\u00b0 C because it's in\n\n00:12:25,870 --> 00:12:28,670\nwill go down to 3\u00b0 C because it's in direct contact but look now the density\n\n00:12:28,670 --> 00:12:31,470\ndirect contact but look now the density is lower than the layers below which\n\n00:12:31,470 --> 00:12:34,230\nis lower than the layers below which means it cannot sink it will keep\n\n00:12:34,230 --> 00:12:38,389\nfloating and these layers will not have a chance to keep come in contact with\n\n00:12:38,389 --> 00:12:40,069\na chance to keep come in contact with the surrounding layer and therefore\n\n00:12:40,069 --> 00:12:42,269\nthe surrounding layer and therefore relatively they will stay warm pretty\n\n00:12:42,269 --> 00:12:45,150\nrelatively they will stay warm pretty close to 4\u00b0 C and now as the temperature\n\n00:12:45,150 --> 00:12:47,990\nclose to 4\u00b0 C and now as the temperature keeps dropping this is the layer that's\n\n00:12:47,990 --> 00:12:49,750\nkeeps dropping this is the layer that's whose temperature will keep dropping\n\n00:12:49,750 --> 00:12:51,430\nwhose temperature will keep dropping keeping the lower layers warm and\n\n00:12:51,430 --> 00:12:53,590\nkeeping the lower layers warm and eventually this layer will crystallize\n\n00:12:53,590 --> 00:12:55,750\neventually this layer will crystallize and now it doesn't matter how cold it\n\n00:12:55,750 --> 00:12:59,990\ngets outside the lower layers are protected and this is why only the top\n\n00:12:59,990 --> 00:13:01,829\nprotected and this is why only the top of the water body tends to get Frozen\n\n00:13:01,829 --> 00:13:04,710\nof the water body tends to get Frozen and the bottom will stay relatively warm\n\n00:13:04,710 --> 00:13:06,350\nand the bottom will stay relatively warm and it will stay in the liquid form it\n\n00:13:06,350 --> 00:13:11,560\nand it will stay in the liquid form it allows Aquatic Life to exist\n","video_id":"AJxYCosjRH0","youtube_url":"https://www.youtube.com/watch?v=AJxYCosjRH0"};


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

              });
            }}>Submit</Button>
          </Popover.Close>
          
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

            {videos.filter(v => v.query.includes(search)).map(v => <Button key={crypto.randomUUID()} variant="soft" onClick={() => {
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
