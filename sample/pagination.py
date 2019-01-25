from collections import OrderedDict

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class TunedPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 300
    page_size_query_param = 'per_page'

    def get_paginated_response(self, data) -> 'Response':
        payload = OrderedDict([
            ('total_items', self.page.paginator.count),

            ('next_page_url', self.get_next_link()),
            ('previous_page_url', self.get_previous_link()),

            ('has_previous_page', self.page.has_previous()),
            ('has_next_page', self.page.has_next()),

            ('previous_page_number', self.page.previous_page_number() if self.page.has_previous() else None),
            ('next_page_number', self.page.next_page_number() if self.page.has_next() else None),

            ('current_page_number', self.page.number),
            ('total_pages', self.page.paginator.num_pages),

            ('list', data),
        ])
        return Response(data=payload)
