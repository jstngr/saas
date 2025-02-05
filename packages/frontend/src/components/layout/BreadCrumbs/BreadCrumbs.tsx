import { ActionIcon, Anchor, Group, Text } from "@mantine/core";
import {
  IconArrowLeft,
  IconMinusVertical,
  IconSlash,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";

interface BreadCrumbItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface IBreadCrumbsProps {
  items: BreadCrumbItem[];
  className?: string;
}

export default function BreadCrumbs({ items }: IBreadCrumbsProps) {
  const navigate = useNavigate();

  const breadcrumbItems = items.map((item, index) => (
    <>
      <Anchor
        key={`${item.title}-${index}`}
        to={item.href}
        c="black"
        underline="never"
        component={Link}
      >
        <Group gap={"xs"} align="center" wrap="nowrap">
          {item.icon}
          <Text size="sm">{item.title}</Text>
        </Group>
      </Anchor>
      {index !== items.length - 1 && (
        <IconSlash
          size={16}
          color="var(--mantine-color-gray-6)"
          key={`${item.title}-${index}-slash`}
        />
      )}
    </>
  ));

  return (
    <Group gap={"sm"}>
      <ActionIcon variant="subtle" color="black" onClick={() => navigate(-1)}>
        <IconArrowLeft size={16} />
      </ActionIcon>
      <IconMinusVertical size={16} color="var(--mantine-color-gray-6)" />
      {breadcrumbItems}
      {/* <Anchor c={"black"}>
        <Group gap={"xs"} align="center" wrap="nowrap">
          <IconHome2 size={16} />
          <Text size="sm">Home</Text>
        </Group>
      </Anchor>
      <IconSlash size={16} color="var(--mantine-color-gray-6)" />
      <Anchor c={"black"}>
        <Group gap={"xs"} align="center" wrap="nowrap">
          <IconMail size={16} />
          <Text size="sm">Mails</Text>
        </Group>
      </Anchor> */}
    </Group>
  );
}
