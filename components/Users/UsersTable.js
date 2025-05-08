import React from 'react';
import {
    ActionIcon,
    Anchor,
    Avatar,
    Badge,
    Box,
    Container,
    Group,
    rem,
    Space,
    Stack,
    Table,
    Text
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import { getLogger } from '@/utils/logger/logger';

import { getInitials } from '@/utils/common-utils';

const logger = getLogger('UsersTable');

const jobColors = {
    user: 'blue',
    admin: 'cyan'
};

export function UsersTable({ users = [] }) {
    logger.info(`Inside UsersTable component..`);
    
    const rows = users.map((user) => (
      <tr key={user.id}>
          <td>
              <Group gap="sm">
                  <Avatar
                    radius="xl"
                    color="initials"
                    // allowedInitialsColors={['blue', 'red', 'cyan', 'pink', 'violet', 'indigo', 'teal', 'lime',
                    // 'green', 'orange', 'yellow']}
                  >
                      {getInitials(user.name)}
                  </Avatar>
                  <Text fz="sm" fw={500}>
                      {user.name}
                  </Text>
              </Group>
          </td>
          <td>
              <Badge color={user.isAdmin ? jobColors['admin'] : jobColors['user']} variant="light">
                  {user.isAdmin ? 'Admin' : 'User'}
              </Badge>
          </td>
          <td>
              <Anchor component="button" size="sm">
                  {user.email}
              </Anchor>
          </td>
          <td>
              <Text fz="sm">{user.isVerified ? 'Verified' : 'Not Verified'}</Text>
          </td>
          <td>
              <Text fz="sm">{format(new Date(user.createdAt), 'MM/dd/yyyy')}</Text>
          </td>
          <td>
              <Text fz="sm">{user.id}</Text>
          </td>
          <td>
              <Group gap={0} justify="flex-end">
                  <ActionIcon variant="subtle" color="gray">
                      <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red">
                      <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  </ActionIcon>
              </Group>
          </td>
      </tr>
    ));
    
    return (
      <Container
        size="100rem"
        pb="xl"
      >
          <Stack spacing="lg" padding={['sm', 'lg']}>
              <Space h="xl" />
              <Box sx={{ overflowX: 'auto' }}>
                  <Table verticalSpacing="sm">
                      <thead>
                      <tr>
                          <th>Username</th>
                          <th>Role</th>
                          <th>Email</th>
                          <th>Verification Status</th>
                          <th>Created At</th>
                          <th>UserId</th>
                          <th />
                      </tr>
                      </thead>
                      <tbody>{rows}</tbody>
                  </Table>
              </Box>
              <Space h="xl" />
          </Stack>
      </Container>
    );
}
