import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { Button, Box, InputTime, Heading } from '@looker/components'

export const InputTimeDemo: FC = () => {
  const [controlledTime, setControlledTime] = useState()
  const handleControlledTimeClick = () => {
    setControlledTime('')
  }
  return (
    <DemoWrapper>
      <div>
        <HeadingGrid>
          <Heading as="h1">Basic Input</Heading>
          <SelectedDateWrapper>Selected:</SelectedDateWrapper>
        </HeadingGrid>
        <InputTime m="small" />
      </div>
      <div>
        <HeadingGrid>
          <Heading as="h1">Controlled Component</Heading>
        </HeadingGrid>
        <Button mr="small" onClick={handleControlledTimeClick}>
          2:00pm
        </Button>
        <Button mr="small" onClick={handleControlledTimeClick}>
          3:15pm
        </Button>
        <Button mr="small" onClick={handleControlledTimeClick}>
          4:30pm
        </Button>
        <Box mt="large">
          <InputTime value={controlledTime} />
        </Box>
      </div>
      <div>
        <HeadingGrid>
          <Heading as="h1">24 Hour Time</Heading>
          <SelectedDateWrapper>Selected:</SelectedDateWrapper>
        </HeadingGrid>
        <div>
          <InputTime format="24h" />
        </div>
      </div>
      <div>
        <HeadingGrid>
          <Heading as="h1">defaultValue</Heading>
        </HeadingGrid>
        <InputTime />
      </div>
    </DemoWrapper>
  )
}

const DemoWrapper = styled.div`
  padding: 2rem;
`

const HeadingGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  border-bottom: 3px solid ${({ theme }) => theme.colors.palette.charcoal300};
  padding-top: 3rem;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  grid-gap: 1rem;
  align-items: center;
`

const SelectedDateWrapper = styled.div`
  display: inline-block;
  color: ${({ theme }) => theme.colors.palette.blue500};
`
