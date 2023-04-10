import { forwardRef, useEffect, useState } from "react";
import { Select } from '@mantine/core';
import { api } from "~/utils/api";

interface TeamGameSelectorProps {
    team: string;
}

export default function TeamGameSelector(props: TeamGameSelectorProps) {
    return (
        <Select
            data
        />
    )
}
