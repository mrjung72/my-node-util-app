# my-node-util-app



awk '{ for(i=1;i<=NF;i++) if($i ~ /^@/) print $i }' your_file.txt


awk '{
  while (match($0, /@[a-zA-Z0-9_]+/)) {
    print substr($0, RSTART, RLENGTH)
    $0 = substr($0, RSTART + RLENGTH)
  }
}' your_file.txt
