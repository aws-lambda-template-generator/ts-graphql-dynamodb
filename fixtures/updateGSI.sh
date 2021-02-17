aws dynamodb update-table \
  --endpoint-url http://localhost:8111 \
  --table-name local_movies \
  --attribute-definitions AttributeName=title,AttributeType=S \
  --global-secondary-index-updates \
  "[{\"Create\":{\"IndexName\": \"MovieTitle-index\",\"KeySchema\":[{\"AttributeName\":\"title\",\"KeyType\":\"HASH\"}], \
  \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5      },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]"
